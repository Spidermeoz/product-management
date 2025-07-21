// Cập nhật số luoợng sản phẩm trong giỏ hàng
const inputQuantity = document.querySelectorAll("input[name='quantity']");

if (inputQuantity.length > 0) {
    inputQuantity.forEach((input) => {
        input.addEventListener("change", async (e) => {
            const productId = input.getAttribute("product-id");
            const quantity = parseInt(e.target.value);

            window.location.href = `/cart/update/${productId}/${quantity}`;
        })
    })
}
// Hêt cập nhật