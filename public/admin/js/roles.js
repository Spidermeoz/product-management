// Permissions
const tablePermissions = document.querySelector("[table-permissions]");

if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");

  buttonSubmit.addEventListener("click", () => {
    let permissions = [];

    const rows = tablePermissions.querySelectorAll("[data-name]");

    rows.forEach((row) => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");

      if (name == "id") {
        inputs.forEach((input) => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;

          //   console.log(name);
          //   console.log(index);
          //   console.log(checked);
          //   console.log("---------------");
          if (checked) {
            permissions[index].permissions.push(name);
          }
        });
      }
    });

    console.log(permissions);
    if (permissions.length > 0) {
      const formchangePermissions = document.querySelector(
        "#form-change-permissions"
      );
      const inputPermissions = formchangePermissions.querySelector(
        "input[name='permissions']"
      );
      inputPermissions.value = JSON.stringify(permissions);

      formchangePermissions.submit();
    }
  });
}
// End Permissions

// Permissions data default
const dataRecords = document.querySelector("[data-record]");
if (dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-record"));
  const tablePermissions = document.querySelector("[table-permissions]");

  records.forEach((record, index) => {
    const permissions = record.permissions;

    permissions.forEach((permission) => {
      const row = tablePermissions.querySelector(`[data-name=${permission}]`);
      const input = row.querySelectorAll("input")[index];

      input.checked = true;
    });
  });
}
// End Permissions data default
