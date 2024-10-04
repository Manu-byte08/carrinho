document.addEventListener('DOMContentLoaded', () => {
    const qtyButtons = document.querySelectorAll('.qty button');
    const removeButtons = document.querySelectorAll('.remove');
    const subtotalDisplay = document.getElementById('subtotal');
    const totalDisplay = document.getElementById('total');
    const checkoutButton = document.getElementById('checkoutButton');
    const paymentInfo = document.getElementById('paymentOptions');
    const customerInfo = document.getElementById('customerInfo');
    const generatePixButton = document.getElementById('generatePix');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const cardInfo = document.getElementById('cardInfo');
    const boletoInfo = document.getElementById('boletoInfo');
    const qrcodeDiv = document.getElementById('qrcode');

    // Função para calcular o subtotal e total
    function calculateTotal() {
        let subtotal = 0;
        document.querySelectorAll('tbody tr').forEach(row => {
            const price = parseFloat(row.children[1].textContent.replace('R$', '').replace(',', '.'));
            const qty = parseInt(row.querySelector('.qty span').textContent);
            const rowTotal = price * qty;
            subtotal += rowTotal;
            row.children[3].textContent = `R$ ${rowTotal.toFixed(2)}`; // Atualiza o total da linha
        });
        subtotalDisplay.textContent = subtotal.toFixed(2); // Atualiza o subtotal
        totalDisplay.textContent = subtotal.toFixed(2); // Atualiza o total
    }

    // Eventos para aumentar/diminuir quantidade
    qtyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const qtySpan = button.parentElement.querySelector('span');
            let qty = parseInt(qtySpan.textContent);
            if (button.innerHTML.includes('bx-minus')) {
                if (qty > 1) qty--;
            } else {
                qty++;
            }
            qtySpan.textContent = qty;
            calculateTotal(); // Recalcula total após mudança
        });
    });

    // Eventos para remover produtos
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('tr').remove();
            calculateTotal(); // Recalcula total após remoção
        });
    });

    // Mostrar informações do cliente e opções de pagamento ao clicar em "Finalizar Compra"
    checkoutButton.addEventListener('click', () => {
        customerInfo.style.display = 'block'; // Exibe informações do cliente
        paymentInfo.style.display = 'block'; // Exibe opções de pagamento
    });

    // Gerar código PIX
    generatePixButton.addEventListener('click', () => {
        const pixKey = "seu_pix_key"; // Substitua pela sua chave PIX
        const amount = totalDisplay.textContent.replace(',', '.');

        const pixData = `pix:${pixKey}?amount=${amount}`;

        // Limpa o conteúdo anterior do QR Code
        $(qrcodeDiv).empty();

        // Gera o código QR
        $(qrcodeDiv).qrcode({
            text: pixData,
            width: 128,
            height: 128,
        });
    });

    // Mostrar informações de pagamento baseadas na seleção
    paymentMethodSelect.addEventListener('change', (e) => {
        const selectedMethod = e.target.value;
        cardInfo.style.display = selectedMethod === 'card' ? 'block' : 'none';
        boletoInfo.style.display = selectedMethod === 'boleto' ? 'block' : 'none';
    });

    // Enviar pedido
    document.getElementById('submitOrder').addEventListener('click', () => {
        const name = document.getElementById('customerName').value;
        const email = document.getElementById('customerEmail').value;
        const phone = document.getElementById('customerPhone').value;

        if (!name || !email || !phone) {
            alert("Por favor, preencha todas as informações do cliente.");
            return;
        }

        alert(`Pedido enviado com sucesso!\nNome: ${name}\nEmail: ${email}\nTelefone: ${phone}`);
        paymentInfo.style.display = 'none'; // Esconde opções de pagamento
        customerInfo.style.display = 'none'; // Esconde informações do cliente
        $(qrcodeDiv).empty(); // Limpa o QR Code
    });

    // Calcular total na inicialização
    calculateTotal();
});
