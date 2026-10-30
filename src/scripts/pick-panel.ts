/**
 * <pick-panel>: buttons ([data-pick]) that show one panel ([data-panel]) at a
 * time. Without JavaScript nothing hides, so every panel stays readable.
 * `data-hover` also switches with the pointer (for icon bars). The current id
 * is mirrored in data-current, so the CSS can react to it.
 */
class PickPanel extends HTMLElement {
  connectedCallback() {
    const own = <T extends Element>(selector: string) => [...this.querySelectorAll<T>(selector)].filter((el) => el.closest('pick-panel') === this);
    const buttons = own<HTMLButtonElement>('[data-pick]');
    const panels = own<HTMLElement>('[data-panel]');
    if (buttons.length === 0) return;

    const select = (id: string, focus = false) => {
      this.dataset.current = id;
      for (const button of buttons) {
        const on = button.dataset.pick === id;
        button.setAttribute('aria-selected', String(on));
        button.tabIndex = on ? 0 : -1;
        if (on && focus) button.focus();
      }
      for (const panel of panels) panel.hidden = panel.dataset.panel !== id;
    };

    select(this.dataset.initial ?? buttons[0]!.dataset.pick!);

    for (const button of buttons) {
      button.addEventListener('click', () => select(button.dataset.pick!));
      if ('hover' in this.dataset) {
        button.addEventListener('pointerenter', (event) => {
          if (event.pointerType === 'mouse') select(button.dataset.pick!);
        });
      }
      button.addEventListener('keydown', (event) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
        if (!step) return;
        event.preventDefault();
        const next = buttons[(buttons.indexOf(button) + step + buttons.length) % buttons.length]!;
        select(next.dataset.pick!, true);
      });
    }
  }
}

if (!customElements.get('pick-panel')) customElements.define('pick-panel', PickPanel);
