// Button status
const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {
  let url = new URL(window.location.href);

  buttonsStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }

      console.log(url.href);
      window.location.href = url.href;
    });
  });
}
// End button status

// Search product
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn gửi form mặc định
    const keyword = e.target.elements.keyword.value.trim();
    console.log(e.target.elements.keyword.value);
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
// End search product

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
  buttonsPagination.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault(); // Ngăn gửi form mặc định
      let url = new URL(window.location.href);
      const page = button.getAttribute("button-pagination");
      if (page) {
        url.searchParams.set("page", page);
      } else {
        url.searchParams.delete("page");
      }
      window.location.href = url.href;
    });
  });
}
// End pagination

// Checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputIds = checkboxMulti.querySelectorAll("input[name='ids']");

  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputIds.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputIds.forEach((input) => {
        input.checked = false;
      });
    }

    inputIds.forEach((input) => {
      input.addEventListener("click", () => {
        const countChecked = checkboxMulti.querySelectorAll(
          "input[name='ids']:checked"
        ).length;

        if (countChecked === inputIds.length) {
          inputCheckAll.checked = true;
        } else {
          inputCheckAll.checked = false;
        }
      });
    });
  });
}
// End checkbox multi

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn gửi form mặc định
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMulti.querySelectorAll(
      "input[name='ids']:checked"
    );

    // Lấy giá trị của select type
    const typeChange = e.target.elements.type.value;

    if (typeChange === "delete-all") {
      const isConfirm = confirm(
        "Bạn có chắc chắn muốn xóa tất cả sản phẩm đã chọn không?"
      );
      if (!isConfirm) {
        return;
      }
    }

    if (inputChecked.length > 0) {
      let Ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputChecked.forEach((input) => {
        const id = input.value;

        if (typeChange === "change-position") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;
          Ids.push(`${id}-${position}`);
        } else {
          Ids.push(id);
        }
      });

      console.log(Ids.join(","));
      inputIds.value = Ids.join(",");

      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất một sản phẩm để thay đổi trạng thái.");
    }
  });
}
// End form change multi

// Show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End show alert

// Upload image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
// End upload image
