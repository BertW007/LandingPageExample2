import Module from '../module';

export default class Nav extends Module {
  constructor() {
    super();
    this.slideSpeed = 'slow';
    this.buttonId = '.toggle-nav';
    this.buttonPartId = '.icon-part';
    this.contentId = 'nav';
    this.contentButtonId = '.nav-item';
    this.buttonStateId = 'aria-pressed';
    this.contentStateId = 'aria-expanded';
    this.buttonStateVariants = [
      'nav-close',
      'nav-open',
    ];
  }

  setState(element, stateId, state) {
    element.attr(stateId, state);
  }

  getState(element, stateId) {
    return element.attr(stateId) === 'false'? false: true;
  }

  toggleButtonClass(button) {
    button.hasClass(this.buttonStateVariants[1])?
      (
        button.removeClass(this.buttonStateVariants[1]),
        button.addClass(this.buttonStateVariants[0])
      ):
      (
        button.addClass(this.buttonStateVariants[1]),
        button.removeClass(this.buttonStateVariants[0])
      );
  }

  toggleButtonView() {
    this.getState(this.button, this.buttonStateId)?
    this.animateButtonParts():
    this.reverseAnimateButtonParts();
    this.toggleButtonClass(this.button);
  }

  animateButtonParts() {
    $(this.buttonParts[0]).velocity({translateY: '8px',rotateZ: '135deg'},{duration: 300});
    $(this.buttonParts[1]).velocity({translateX: '-40px',opacity: 0},{duration: 300});
    $(this.buttonParts[2]).velocity({translateY: '-8px', rotateZ: '-135deg'},{duration: 300,
    complete: () => {
      this.button.on('click', this.handleButtonClick.bind(this));
    }});
  }

  reverseAnimateButtonParts() {
    this.buttonParts.velocity(
      'reverse',
      { complete: () => { this.button.on('click', this.handleButtonClick.bind(this)) } }
    );
  }

  toggleButton(button) {
    this.getState(button, this.buttonStateId)?
    this.setState(button, this.buttonStateId, false):
    this.setState(button, this.buttonStateId, true);
  }

  handleButtonClick() {
    this.button.off('click');
    this.toggleButton(this.button);
    this.toggleButtonView();
    this.toggleContent();
  }

  toggleContent(bp) {
    this.getState(this.content, this.contentStateId)?
    this.setState(this.content, this.contentStateId, false):
    this.setState(this.content, this.contentStateId, true);
    bp?
    (
      $(window).width() < bp? this.content.slideToggle(this.slideSpeed): false
    ):
    this.content.slideToggle(this.slideSpeed);
  }

  handleNavButtonsClick(e) {
    const button = $(e.currentTarget),
          target = $('#' + e.currentTarget.innerText.trim().toLowerCase());
    this.setAllNavButtonPressedState(false);
    this.toggleButton(button);
    target.velocity('scroll', {duration: 2000, offset: -60, easing: 'easeInOutCubic'});
    this.toggleContent(768);
    $(window).width() < 768?
    (
      this.button.off('click'),
      this.toggleButton(this.button),
      this.toggleButtonView()
    ):
    false;
  }

  setAllNavButtonPressedState(state) {
    this.setState(this.navButtons, this.buttonStateId, state);
  }

  init() {
    this.content = this.find(this.contentId);
    this.button = this.find(this.buttonId);
    this.buttonParts = this.find(this.buttonPartId);
    this.navButtons = this.find(this.contentButtonId);
    this.registerDomEvent(this.buttonId, 'click', this.handleButtonClick.bind(this));
    this.registerDomEvent(this.contentButtonId, 'click', this.handleNavButtonsClick.bind(this));
  };
}
