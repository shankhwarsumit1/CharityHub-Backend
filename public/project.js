const donateButton = document.getElementById('donate');
const projectIdInput = document.getElementById('projectId');
const amountInput = document.getElementById('amount');

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = './login.html';
};

donateButton.addEventListener('click', async () => {
    const projectId = projectIdInput.value;
    const amount = amountInput.value;

    if (!projectId || !amount) {
        alert('Please enter both Project ID and Amount');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/createOrder', {
            projectId,
            amount
        }, {
            headers: {
                'token': token
            }
        });
        console.log(response);
        const options = {
            key: response.data.keyId,
            amount: amount * 100,
            currency: response.data.order.currency,
            name: "Donation",
            description: "social work",
            order_id: response.data.order.id,
            theme: {
                color: "#F37254"
            }
        }

        //now it should open razorpay checkout box
        const rzp = new window.Razorpay(options)
        rzp.open();
    
        const res = await axios.get(`http://localhost:3000/getDonationReceipt/${8}`,{
            headers:{
                token
            }
        });

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href=url;
        link.setAttribute("download",`receipt-donation1`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error(error);
        alert('Error creating order');
    }
})