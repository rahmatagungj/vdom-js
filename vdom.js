function createVNode(tag, props = {}, children = []) {
  return { tag, props, children }
}

function mount(vnode, container) {
  const element = (vnode.element = document.createElement(vnode.tag))

  Object.entries(vnode.props || {}).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })

  if (typeof vnode.children === "string") {
    element.textContent = vnode.children
  } else {
    vnode.children.forEach((child) => {
      mount(child, element) // Mount Child secara rekursif
    })
  }

  container.appendChild(element)
}

function unmount(vnode) {
  vnode.element.parentNode.removeChild(vnode.element)
}

function patch(VNode1, VNode2) {
  // Tetapkan elemen ke DOM induk
  const element = (VNode2.element = VNode1.element)

  // Sekarang kita harus memeriksa perbedaan antara kedua vnode

  // Jika node memiliki tag yang berbeda, asumsikan bahwa seluruh konten telah berubah.
  if (VNode1.tag !== VNode2.tag) {
    // Lepas saja tag lama dan pasang tag baru
    mount(VNode2, element.parentNode)
    unmount(Vnode1)
  } else {
    // Node memiliki tag yang sama
    // Jadi kami memiliki dua cek tersisa
    // - Props
    // - Children

    // Memeriksa children
    // Jika tag baru memiliki string untuk children
    if (typeof VNode2.children == "string") {
      // Jika kedua children itu **sangat** berbeda
      if (VNode2.children !== VNode1.children) {
        element.textContent = VNode2.children
      }
    } else {
      // Jika node baru memiliki array children
      // - Panjang dari children sama
      // - Node lama memiliki lebih banyak children daripada yang baru
      // - Node baru memiliki lebih banyak children daripada yang lama

      // Cari tahu panjangnya
      const children1 = VNode1.children
      const children2 = VNode2.children
      const commonLen = Math.min(children1.length, children2.length)

      // Panggil patch secara rekursif untuk semua children biasa
      for (let i = 0; i < commonLen; i++) {
        patch(children1[i], children2[i])
      }

      // Jika tag baru memiliki lebih sedikit children
      if (children1.length > children2.length) {
        children1.slice(children2.length).forEach((child) => {
          unmount(child)
        })
      }

      // Jika tag baru memiliki lebih banyak children
      if (children2.length > children1.length) {
        children2.slice(children1.length).forEach((child) => {
          mount(child, element)
        })
      }
    }
  }
}
