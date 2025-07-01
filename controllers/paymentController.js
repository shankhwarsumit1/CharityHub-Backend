const {
    createRazorpayInstance
} = require('../utils/razorpayConfig');
const razorpayInstance = createRazorpayInstance();
const PaymentModel = require('../models/PaymentModel');
const {
    validateWebhookSignature
} = require('razorpay/dist/utils/razorpay-utils');
const {
    DonationModal,
    CharityProjectModel,
} = require('../models');
const sequelize = require('../utils/db-connect');
const sendMail = require('../utils/mailService');

const createOrder = async (req, res) => {
    try {
        const {
            projectId,
            amount
        } = req.body;
        const user = req.user;
        const project = await CharityProjectModel.findOne({
            where: {
                id: projectId
            }
        });
        if (!project) {
            return res.status(404).json({
                message: 'project not found'
            })
        }
        if (project.status !== 'accepted') {
            return res.status(400).json({
                message: 'project is not approved by admin'
            });
        }
        const userId = req.user.id;
        const DonationAmount = parseInt(amount);
        const options = {
            amount: DonationAmount * 100,
            currency: 'INR',
            receipt: 'receipt_order_1',
            payment_capture: 1,
            notes: {
                userName: user.name,
                userEmail: user.email,
                projectName: project.projectName
            }
        };

        razorpayInstance.orders.create(options, async (err, order) => {
            if (err) {
                return res.status(500).json({
                    ERROR: 'something went wrong while creating order'
                });
            }
            //store in database
            await PaymentModel.create({
                orderId: order.id,
                amount: DonationAmount,
                currency: 'INR',
                status: 'pending',
                userId: userId,
                paymentId: null,
                projectId: projectId
            });
            return res.status(201).json({
                message: 'order created successfully',
                order,
                keyId: process.env.RAZORPAY_KEY_ID
            });
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ERROR: err.message
        });
    }
}

const webhook = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const webhookSignature = req.headers["x-razorpay-signature"];

        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if (!isWebhookValid) {
            return res.status(400).json({
                msg: 'webhook signature is not valid'
            });
        }


        const paymentDetails = req.body.payload.payment.entity;


        const payment = await PaymentModel.findOne({
            where: {
                orderId: paymentDetails.order_id
            }
        });

        if (!payment) {
            throw new Error('Payment record not found for this order_id');
        }

        payment.paymentId = paymentDetails.id;
        if (paymentDetails.status === 'captured') {
            payment.status = 'successfull';
            await payment.save({
                transaction
            });
            await DonationModal.create({
                amount: paymentDetails.amount / 100,
                userId: payment.userId,
                projectId: payment.projectId,
                orderId: paymentDetails.order_id
            }, {
                transaction
            })

            const CharityProject = await CharityProjectModel.findByPk(payment.projectId);
            CharityProject.fundsRecieved += payment.amount;
            await CharityProject.save({
                transaction
            });
            const status = "successfull";
            sendMail(paymentDetails, status);
        } else {
            payment.status = paymentDetails.status;
            await payment.save({
                transaction
            });
            const status = paymentDetails.status;
            sendMail(paymentDetails, status);
        }
        await transaction.commit();
        return res.status(200).json({
            msg: 'webhook received successfully'
        });

    } catch (err) {
        transaction.rollback();
        console.log(err);
        res.status(500).json({
            'ERROR': err.message
        });
    }
}

module.exports = {
    createOrder,
    webhook
}