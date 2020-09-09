import { printLog } from "utils/console";
import "./index.less";

class Animal {
  constructor(name) {
    this.name = name;
  }
}

const dog = new Animal("Tom");
console.log(dog);
printLog("日志");

document.getElementById("btn").onclick = function () {
  import("./hello").then((fn) => fn.default());
};

if (module && module.hot) {
  module.hot.accept();
}

fetch("getInfo")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
