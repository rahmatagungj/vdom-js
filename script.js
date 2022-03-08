function generateList(list) {
  let children = list.map((child) => createVNode("li", null, child))

  return createVNode("ul", { class: "fruits-ul" }, children)
}

let list = generateList(["apple", "banana", "orange"])

mount(list, document.querySelector("#app"))

setTimeout(
  () => patch(list, generateList(["apple", "banana", "pineapple changed"])),
  3000
)
