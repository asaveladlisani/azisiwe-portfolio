const fs = require("fs");
const path = require("path");

function showFolderStructure(dirPath, indent = "") {
  let items;

  try {
    items = fs.readdirSync(dirPath);
  } catch (err) {
    console.log(indent + "[Permission Denied]");
    return;
  }

  items.forEach((item, index) => {
    const itemPath = path.join(dirPath, item);
    const isLast = index === items.length - 1;
    const prefix = isLast ? "└── " : "├── ";

    console.log(indent + prefix + item);

    if (fs.statSync(itemPath).isDirectory()) {
      showFolderStructure(itemPath, indent + (isLast ? "    " : "│   "));
    }
  });
}

// 👇 Change path if needed
showFolderStructure("./");
