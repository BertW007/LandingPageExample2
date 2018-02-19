import Module from '../module';

export default class Nav extends Module {
  constructor() {
    super();
    this.content = this.find('nav');
    this.button = this.find('.toggle-nav');
    this.buttonParts = this.find('.icon-part');
    this.navButtons = this.find('.nav-item');
    this.wrapper = this.find('.header-nav-wrapper');
    this.direction = 0;
    this.currentPosition = 0;
    this.slideSpeed = 'slow';
    this.buttonStateId = 'aria-pressed';
    this.contentStateId = 'aria-expanded';
    this.buttonStateVariants = [
      'nav-close',
      'nav-open',
    ];
    this.wrapperStateVariants = [
      'scrolling',
    ];
    this.wrapperChangePosition = 50;
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
  }

  animateButtonParts() {
    $(this.buttonParts[0]).velocity('stop').velocity({translateY: '8px',rotateZ: '135deg'},{duration: 300});
    $(this.buttonParts[1]).velocity('stop').velocity({translateX: '-40px',opacity: 0},{duration: 300});
    $(this.buttonParts[2]).velocity('stop').velocity({translateY: '-8px', rotateZ: '-135deg'},{duration: 300,
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
    this.toggleButtonClass(this.button);
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
    target.velocity('stop').velocity('scroll', {duration: 2000, offset: 0, easing: 'easeInOutCubic'});
    this.toggleContent(768);
    $(window).width() < 768?
    (
      this.button.off('click'),
      this.toggleButton(this.button),
      this.toggleButtonClass(this.button),
      this.toggleButtonView()
    ):
    false;
  }

  setAllNavButtonPressedState(state) {
    this.setState(this.navButtons, this.buttonStateId, state);
  }

  getScrollPosition() {
    return (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
  }

  spyPosition() {
    this.emit('POS', this.getScrollPosition())
  }

  getToSpyPositions() {
    return this.find('.spy-position');
  }

  setDirection(position) {
    position > this.currentPosition? this.direction = 0: this.direction = 1;
    this.currentPosition = position;
  }

  setNextAnchor(position) {
    this.avlAn = this.toSpy.filter((key,item) => {
      return this.direction === 0?
      item.offsetTop > position? item: false:
      item.offsetTop < position? item: false;
    });
    this.direction === 0? false: this.avlAn = this.avlAn.get().reverse();
    // console.log(this.avlAn[0].offsetTop + this.avlAn[0].offsetHeight);
    //this.avlAn[0].offsetTop + this.avlAn[0].offsetHeight
    if(this.avlAn[0]) {
      if(this.direction===0) {
        position > this.avlAn[0].offsetTop-60? this.toggleNavItemClass(this.avlAn[0]): false;
      }

      if(this.direction===1) {
        console.log(this.avlAn[0].offsetHeight);
        position < this.avlAn[0].offsetTop + 60?
        this.toggleNavItemClass(this.avlAn[0]): false;
      }

    } else {
      this.toggleNavItemClass();
    }

    // if(this.avlAn[0]) {
    //   !this.prevDiff? this.prevDiff = this.avlAn[0].offsetTop: false;
    //   this.nextDiff = this.avlAn[0].offsetTop - position;
    //
    //   if(this.direction === 0) {
    //     this.nextDiff > this.prevDiff? this.toggleNavItemClass(this.avlAn[0]): false;
    //   }
    //
    //   if(this.direction === 1) {
    //     this.nextDiff < this.prevDiff? console.log(this.avlAn[0]): false;
    //   }
    //   this.prevDiff = this.nextDiff;
    // }
    //
    // if(!this.avlAn[0]) {
    //   this.prevDiff = 0;
    //   this.nextDiff = 0;
    // }

    // this.avlAn[0]? console.log('prev: ', this.prevDiff, 'next: ', this.nextDiff, 'pos: ', position): false;

  }

  toggleNavItemClass(item) {
    if(!item) {
      this.navButtons.removeClass('current');
    } else {
      const nextButton = this.navButtons.filter((key,button) => {
        return button.innerText.trim().toLowerCase() === item.id;
      })

      const currentButton = this.navButtons.filter((key,button) => {
        return $(button).hasClass('current') === true;
      })

      currentButton.removeClass('current');
      !$(nextButton).hasClass('current')? $(nextButton).addClass('current'): false;
    }
  }

  toggleWrapper() {
    this.getScrollPosition() > this.wrapperChangePosition?
      this.wrapper.hasClass(this.wrapperStateVariants[0])?
      false: this.wrapper.addClass(this.wrapperStateVariants[0]):
    this.wrapper.removeClass(this.wrapperStateVariants[0]);
  }

  init() {
    this.sub('POS',this.setDirection.bind(this));
    this.sub('POS',this.setNextAnchor.bind(this));
    this.toSpy = this.getToSpyPositions();
    this.registerDomEvent(window, 'scroll', this.spyPosition.bind(this));
    this.registerDomEvent('.toggle-nav', 'click', this.handleButtonClick.bind(this));
    this.registerDomEvent('.nav-item', 'click', this.handleNavButtonsClick.bind(this));
  };
}
