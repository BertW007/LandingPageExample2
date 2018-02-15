import Module from '../module';

export default class Banner extends Module {
  constructor() {
    super();
    this.direction = 0;
    this.delay = 5000;
    this.currentId = 'current';
    this.animVariants = [
      [
        {opacity: 0, scale: 1.5},
        {opacity: [1, 0], scale: [1, 1.5]}
      ],
      [
        {opacity: [1, 0], translateY: ['0px', '-50px']}
      ]
    ];
  }

  setModuleId(id) {
    this.moduleId = this.modulePrefix + id + this.moduleSuffix;
    this.bannersId = this.moduleId + 'content';
    this.leftButtonId = this.moduleId + 'controls-left';
    this.rightButtonId = this.moduleId + 'controls-right';
  }

  getDirection() {
    return this.direction;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  getNext() {
    return this.banners[this.banners.index(this.getCurrent())+1];
  }

  getPrev() {
    return this.banners[this.banners.index(this.getCurrent())-1];
  }

  getCurrent() {
    return this.banners.filter((key, banner) => {
      return $(banner).hasClass(this.currentId) && !this.isAnimating(banner)? banner: false;
    });
  }

  isAnimating(item) {
    return $(item).hasClass('velocity-animating');
  }

  getAbsNext() {
    let n = this.getNext();
    const p = this.getPrev(),
          dr = this.getDirection();
    dr === 0? n = $(n): n = $(p);
    return n;
  }

  handleClick(e) {
    $(e.target).hasClass(this.leftButtonId.split('.').join("")) ?
    this.setDirection(1):
    this.setDirection(0);
    this.isAnimating(this.getCurrent()) ||
    this.isAnimating(this.getNext()) ||
    this.getCurrent().length !== 1?
    false:
    this.handleCurrentOut();
  }

  handleComplete() {
      this.anx.find('>*').velocity(this.animVariants[1][0],{
        easing: 'easeOutCubic',
        duration: 500,
        delay: 1000,
      })
      this.anx.addClass(this.currentId);
      this.cr.removeClass(this.currentId);
      this.cr.find('>*').css('opacity',0);
      delete this.cr;
      delete this.anx;
  }

  handleNextIn() {
    this.anx.velocity(this.animVariants[0][1], {
      easing: 'easeOutCubic',
      duration: 1000,
      complete: this.handleComplete.apply(this),
    });
  }

  handleCurrentOut() {
    this.anx = this.getAbsNext();
    this.cr = this.getCurrent();
    this.anx.length > 0?
    this.cr.velocity('stop').velocity(this.animVariants[0][0],{
      easing: 'easeOutCubic',
      duration: 1000,
      begin: this.handleNextIn.apply(this),
      complete: this.rotateBanner.apply(this),
    }):false;
  }

  toggleDirection() {
    this.getNext() && !this.getPrev() ? this.setDirection(0):false;
    this.getPrev() && !this.getNext() ? this.setDirection(1):false;
  }

  rotateBanner() {
    const nextRotation = () => {
      this.toggleDirection()
      this.handleCurrentOut();
    }
    clearTimeout(this.id);
    this.id = setTimeout(nextRotation, this.delay);
  }

  initCurrent() {
    this.getCurrent().css('opacity',1).css('transform','scale(1)'); //TODO add browsers prefixes
    this.getCurrent().find('>*').css('opacity',1);
  }

  init() {
    this.setModuleId('banner');
    this.banners = this.find(this.bannersId);
    this.initCurrent();
    this.registerDomEvent(this.leftButtonId, 'click', this.handleClick.bind(this));
    this.registerDomEvent(this.rightButtonId, 'click', this.handleClick.bind(this));
    this.rotateBanner();
  };
}
