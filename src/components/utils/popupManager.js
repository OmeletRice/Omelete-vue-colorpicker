import {
  addClass,
  removeClass
} from './dom.js'

function getModal() {
  let modalDom = PopupManager.modalDom;
  if (modalDom) {
    return modalDom;
  } else {
    modalDom = document.createElement('div');
    modalDom.addEventListener('touchmove', function (event) {
      event.preventDefault();
      event.stopPropagation();
    });
    modalDom.addEventListener('click', function () {
      PopupManager.doOnModalClick();
    });

    PopupManager.modalDom = modalDom;
    return modalDom;
  }
}

const PopupManager = {
  zIndex: 2000,

  modalDom: null,

  modals: {},

  modalStack: [],

  nextZIndex() {
    return PopupManager.zIndex++;
  },
  // 注册modal实例
  register(popupId, ins) {
    // console.log('register:', popupId, ins)
    if (popupId && ins) {
      this.modals[popupId] = ins;
    }
  },
  // 取消modal
  deregister(popupId) {
    // console.log('deregister:', popupId);
    // 无法真正删除内存
    if (popupId) {
      this.modals[popupId] = null;
      delete this.modals[popupId];
    }
  },
  getIns(popupId) {
    const ins = this.modals[popupId];
    return ins;
  },
  // modal 点击事件
  doOnModalClick() {
    if (PopupManager.modalStack.length === 0) return;
    const topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1];
    // 获取当前需要关闭的实例
    const ins = this.getIns(topItem.id);
    if (ins) {
      ins.close();
    }
  },
  // 传入参数 popupId zIndex
  openModal(popupId, zIndex, where, modalClass, modalFade) {
    // console.log('openModal', 'id:' + popupId, 'zidx:' + zIndex, 'where:' + where, modalClass, modalFade);
    if (!popupId || zIndex === undefined) return;

    // 判断是当前遮罩是否存在 modalStack中
    this.modalStack.forEach(function (modal) {
      if (modal.id === popupId) {
        // console.log('has this modal');
        return;
      }
    });

    // 获取 Modal
    const modalDom = getModal();
    // 添加属性
    addClass(modalDom, 'om-modal');
    // 过渡效果
    addClass(modalDom, 'om-modal-enter');
    setTimeout(() => {
      removeClass(modalDom, 'om-modal-enter');
    }, 200);
    if (zIndex) {
      modalDom.style.zIndex = zIndex;
    }
    modalDom.style.display = '';
    // 添加位置

    if (where) {
      where.parentNode.appendChild(modalDom);
    } else {
      document.body.appendChild(modalDom);
    }

    // 添加到 modalStack
    this.modalStack.push({
      id: popupId,
      zIndex: zIndex,
      modalClass: modalClass
    });

    // console.log(this.modalStack);
  },

  closeModal(popupId) {
    const modalStack = this.modalStack;
    const modalDom = getModal();

    // 判断Stack 中是否有modal
    if (modalStack.length > 0) {
      const topItem = modalStack[modalStack.length - 1];
      // 判断最近的这个
      if (topItem.id === popupId) {
        // 刪掉 这个 modal
        modalStack.pop();
        if (modalStack.length > 0) {
          modalDom.style.zIndex = modalStack[modalStack.length - 1].zIndex;
        }
      } else {
        // 在Stack 中寻找当前取消的 modal 并将之删除  使用 for 优化
        for (let i = modalStack.length - 1; i >= 0; i--) {
          if (modalStack[i].id === popupId) {
            modalStack.splice(i, 1);
            break;
          }
        }
      }
    }

    // 刪除完Stack 中的 modal 接着对modalDom 属性操作
    if (modalStack.length === 0) {
      // 过渡效果
      addClass(modalDom, 'om-modal-leave');
      setTimeout(() => {
        removeClass(modalDom, 'om-modal-leave');
        if (modalDom.parentNode) {
          modalDom.parentNode.removeChild(modalDom);
        }
      }, 200);
    }
  }
}

export default PopupManager;
