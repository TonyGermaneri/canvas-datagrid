/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false, Event: false*/
'use strict';

export default function (self) {
  let zIndexTop;

  function applyButtonMenuItemStyle(buttonMenuItemContainer) {
    self.createInlineStyle(
      buttonMenuItemContainer,
      'canvas-datagrid-button-menu-item' + (self.mobile ? '-mobile' : ''),
    );
    buttonMenuItemContainer.addEventListener('mouseover', function () {
      self.createInlineStyle(
        buttonMenuItemContainer,
        'canvas-datagrid-button-menu-item:hover',
      );
    });
    buttonMenuItemContainer.addEventListener('mouseout', function () {
      self.createInlineStyle(
        buttonMenuItemContainer,
        'canvas-datagrid-button-menu-item',
      );
    });
  }

  function applyButtonStyle(button) {
    self.createInlineStyle(button, 'canvas-datagrid-button-wrapper');
    button.addEventListener('mouseover', function () {
      if (!self.buttonMenu) {
        self.createInlineStyle(button, 'canvas-datagrid-button-wrapper:hover');
      }
    });
    button.addEventListener('mouseout', function () {
      if (!self.buttonMenu) {
        self.createInlineStyle(button, 'canvas-datagrid-button-wrapper');
      }
    });
  }

  function createButton(pos, items, imgSrc) {
    var wrapper = document.createElement('div'),
      buttonArrow = document.createElement('div'),
      buttonIcon = document.createElement('div'),
      intf = {};

    if (!Array.isArray(items)) {
      throw new Error('createButton expects an array.');
    }

    function init() {
      var loc = {},
        s = self.scrollOffset(self.canvas);

      if (zIndexTop === undefined) {
        zIndexTop = self.style.buttonZIndex;
      }

      applyButtonStyle(wrapper);
      self.createInlineStyle(buttonIcon, 'canvas-datagrid-button-icon');
      self.createInlineStyle(buttonArrow, 'canvas-datagrid-button-arrow');

      loc.x = pos.left - s.left;
      loc.y = pos.top - s.top;
      loc.height = 0;
      zIndexTop += 1;
      wrapper.style.position = 'absolute';
      wrapper.style.zIndex = zIndexTop;
      wrapper.style.left = loc.x + 'px';
      wrapper.style.top = loc.y + 'px';
      wrapper.left = pos.left + self.scrollBox.scrollLeft;
      wrapper.top = pos.top + self.scrollBox.scrollTop;
      buttonArrow.innerHTML = self.style.buttonArrowDownHTML;
      if (imgSrc) {
        let img = document.createElement('img');
        img.setAttribute('src', imgSrc);
        img.style.maxWidth = '100%';
        img.style.height = '100%';
        buttonIcon.appendChild(img);
      }
      wrapper.appendChild(buttonIcon);
      wrapper.appendChild(buttonArrow);
      document.body.appendChild(wrapper);
      wrapper.addEventListener('click', toggleButtonMenu);
    }

    intf.wrapper = wrapper;
    intf.items = items;
    init();

    intf.dispose = function () {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    };
    return intf;
  }

  function toggleButtonMenu() {
    function createDisposeEvent() {
      requestAnimationFrame(function () {
        document.addEventListener('click', self.disposeButtonMenu);
      });
    }
    if (self.buttonMenu) {
      self.disposeButtonMenu();
    } else {
      let pos = {
        left: self.button.wrapper.left - self.scrollBox.scrollLeft,
        top:
          self.button.wrapper.top +
          self.button.wrapper.offsetHeight -
          self.scrollBox.scrollTop,
      };
      self.buttonMenu = createButtonMenu(pos, self.button.items);
      self.createInlineStyle(
        self.button.wrapper,
        'canvas-datagrid-button-wrapper:active',
      );
      createDisposeEvent();
    }
  }

  function createButtonMenu(pos, items) {
    var buttonMenu = document.createElement('div'),
      selectedIndex = -1,
      intf = {},
      rect;

    function createItems() {
      function addItem(item, menuItemContainer) {
        function addContent(content) {
          if (content === null) {
            return;
          }

          if (typeof content === 'object') {
            menuItemContainer.appendChild(content);
            return;
          }

          applyButtonMenuItemStyle(menuItemContainer);
          menuItemContainer.innerHTML = content;
          return;
        }

        addContent(item.title);
        item.buttonMenuItemContainer = menuItemContainer;

        if (item.click) {
          menuItemContainer.addEventListener('click', function (ev) {
            item.click.apply(self, [ev]);
          });
        }
      }

      for (let item of items) {
        var buttonMenuItemContainer = document.createElement('div');
        addItem(item, buttonMenuItemContainer);
        buttonMenu.appendChild(buttonMenuItemContainer);
      }
    }

    function clickIndex(idx) {
      items[idx].buttonMenuItemContainer.dispatchEvent(new Event('click'));
    }

    function init() {
      var loc = {},
        s = self.scrollOffset(self.canvas);

      if (zIndexTop === undefined) {
        zIndexTop = self.style.buttonZIndex;
      }

      createItems();
      self.createInlineStyle(
        buttonMenu,
        'canvas-datagrid-button-menu' + (self.mobile ? '-mobile' : ''),
      );

      loc.x = pos.left - s.left;
      loc.y = pos.top - s.top;
      loc.height = 0;
      zIndexTop += 1;
      buttonMenu.style.position = 'absolute';
      buttonMenu.style.zIndex = zIndexTop;
      buttonMenu.style.left = loc.x + 'px';
      buttonMenu.style.top = loc.y + 'px';
      document.body.appendChild(buttonMenu);
      rect = buttonMenu.getBoundingClientRect();

      if (rect.bottom > window.innerHeight) {
        loc.y =
          self.button.wrapper.top -
          buttonMenu.offsetHeight -
          self.scrollBox.scrollTop;
        if (loc.y < 0) {
          loc.y = self.style.buttonMenuWindowMargin;
        }

        if (
          buttonMenu.offsetHeight >
          window.innerHeight - self.style.buttonMenuWindowMargin
        ) {
          buttonMenu.style.height =
            window.innerHeight - self.style.buttonMenuWindowMargin * 2 + 'px';
        }
      }

      if (rect.right > window.innerWidth) {
        loc.x -=
          rect.right - window.innerWidth + self.style.buttonMenuWindowMargin;
      }

      if (loc.x < 0) {
        loc.x = self.style.buttonMenuWindowMargin;
      }

      if (loc.y < 0) {
        loc.y = self.style.buttonMenuWindowMargin;
      }

      buttonMenu.style.left = loc.x + 'px';
      buttonMenu.style.top = loc.y + 'px';
    }

    intf.buttonMenu = buttonMenu;
    init();
    intf.clickIndex = clickIndex;
    intf.rect = rect;
    intf.items = items;

    intf.dispose = function () {
      if (buttonMenu.parentNode) {
        buttonMenu.parentNode.removeChild(buttonMenu);
      }
    };

    Object.defineProperty(intf, 'selectedIndex', {
      get: function get() {
        return selectedIndex;
      },
      set: function set(value) {
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
          throw new Error('Button menu selected index must be a sane number.');
        }

        selectedIndex = value;

        if (selectedIndex > items.length - 1) {
          selectedIndex = items.length - 1;
        }

        if (selectedIndex < 0) {
          selectedIndex = 0;
        }

        items.forEach(function (item, index) {
          if (index === selectedIndex) {
            return self.createInlineStyle(
              item.buttonMenuItemContainer,
              'canvas-datagrid-button-menu-item:hover',
            );
          }

          self.createInlineStyle(
            item.buttonMenuItemContainer,
            'canvas-datagrid-button-menu-item',
          );
        });
      },
    });
    return intf;
  }

  self.disposeButtonMenu = function () {
    if (self.buttonMenu) {
      document.removeEventListener('click', self.disposeButtonMenu);
      self.buttonMenu.dispose();
      self.buttonMenu = undefined;
      self.createInlineStyle(
        self.button.wrapper,
        'canvas-datagrid-button-wrapper:hover',
      );
    }
  };

  self.disposeButton = function (e) {
    if (e && e.keyCode !== 27) return;
    document.removeEventListener('keydown', self.disposeButton);
    zIndexTop = self.style.buttonZIndex;
    self.disposeButtonMenu();

    if (self.button) {
      self.button.dispose();
    }

    self.button = undefined;
  };

  self.moveButtonPos = function () {
    self.button.wrapper.style.left =
      self.button.wrapper.left - self.scrollBox.scrollLeft + 'px';
    self.button.wrapper.style.top =
      self.button.wrapper.top - self.scrollBox.scrollTop + 'px';
    self.disposeButtonMenu();
  };

  self.attachButton = function (pos, items, imgSrc) {
    function createDisposeEvent() {
      requestAnimationFrame(function () {
        document.addEventListener('keydown', self.disposeButton);
      });
    }

    if (self.button) {
      self.disposeButton();
    }

    self.button = createButton(pos, items, imgSrc);
    createDisposeEvent();
  };
  return;
}
