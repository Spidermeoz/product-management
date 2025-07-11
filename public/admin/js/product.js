//Change status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault(); // Ngăn gửi form mặc định
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent === "active" ? "inactive" : "active";

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  });
}
//End Change status

// Delete product
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");
  buttonsDelete.forEach((button) => {
    button.addEventListener("click", () => {
      isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");

        const action = path + `/${id}?_method=DELETE`;

        formDeleteItem.action = action;
        // Gửi form
        formDeleteItem.submit();
        if (!id) {
          alert("Không tìm thấy ID sản phẩm!");
          return;
        }
      }
    });
  });
}
// End delete product
