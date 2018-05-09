import Module from '../module'
import $ from 'jquery'

export default class Nav extends Module {
  constructor () {
    super()
    this.content = this.find('nav')
    this.button = this.find('.toggle-nav')
    this.buttonParts = this.find('.icon-part')
    this.navButtons = this.find('.nav-item')
    this.wrapper = this.find('.header-nav-wrapper')
    this.articles = this.find('article')
    this.direction = 0
    this.currentPosition = 0
    this.slideSpeed = 'slow'
    this.buttonStateId = 'aria-pressed'
    this.contentStateId = 'aria-expanded'
    this.buttonStateVariants = [
      'nav-close',
      'nav-open'
    ]
  }

  setState (element, stateId, state) {
    element.attr(stateId, state)
  }

  getState (element, stateId) {
    if (element.attr(stateId) === 'false') {
      return false
    } else {
      return true
    }
  }

  toggleButtonClass (button) {
    if (button.hasClass(this.buttonStateVariants[1])) {
      button.removeClass(this.buttonStateVariants[1])
      button.addClass(this.buttonStateVariants[0])
    } else {
      button.addClass(this.buttonStateVariants[1])
      button.removeClass(this.buttonStateVariants[0])
    }
  }

  toggleButtonView () {
    this.getState(this.button, this.buttonStateId)
      ? this.animateButtonParts()
      : this.reverseAnimateButtonParts()
  }

  animateButtonParts () {
    $(this.buttonParts[0]).velocity('stop').velocity({translateY: '8px', rotateZ: '135deg'}, {duration: 300})
    $(this.buttonParts[1]).velocity('stop').velocity({translateX: '-40px', opacity: 0}, {duration: 300})
    $(this.buttonParts[2]).velocity('stop').velocity({translateY: '-8px', rotateZ: '-135deg'}, {duration: 300,
      complete: () => {
        this.button.on('click', this.handleButtonClick.bind(this))
      }
    })
  }

  reverseAnimateButtonParts () {
    this.buttonParts.velocity(
      'reverse',
      { complete: () => { this.button.on('click', this.handleButtonClick.bind(this)) } }
    )
  }

  toggleButton (button) {
    this.getState(button, this.buttonStateId)
      ? this.setState(button, this.buttonStateId, false)
      : this.setState(button, this.buttonStateId, true)
  }

  handleButtonClick () {
    this.button.off('click')
    this.toggleButton(this.button)
    this.toggleButtonClass(this.button)
    this.toggleButtonView()
    this.toggleContent()
  }

  toggleContent (bp) {
    this.getState(this.content, this.contentStateId)
      ? this.setState(this.content, this.contentStateId, false)
      : this.setState(this.content, this.contentStateId, true)
    if (bp) {
      if ($(window).width() < bp) {
        this.content.slideToggle(this.slideSpeed)
      }
    } else {
      this.content.slideToggle(this.slideSpeed)
    }
  }

  handleNavButtonsClick (e) {
    const button = $(e.currentTarget)
    const target = $('#' + e.currentTarget.innerText.trim().toLowerCase())
    this.setAllNavButtonPressedState(false)
    this.toggleButton(button)
    target.velocity('stop').velocity('scroll', {duration: 2000, offset: 0, easing: 'easeInOutCubic'})
    this.toggleContent(768)
    if ($(window).width() < 768) {
      this.button.off('click')
      this.toggleButton(this.button)
      this.toggleButtonClass(this.button)
      this.toggleButtonView()
    }
  }

  handleFooterlinksClick (e) {
    e.preventDefault()
    const targetLink = $(e.currentTarget).attr('href')
    const targetAnchor = this.articles.filter((key, article) => {
      return $(article).attr('id') === targetLink.replace('#', '')
    })
    if (targetAnchor.length > 0) {
      targetAnchor.velocity('stop').velocity('scroll', {duration: 2000, offset: 0, easing: 'easeInOutCubic'})
    }
  }

  setAllNavButtonPressedState (state) {
    this.setState(this.navButtons, this.buttonStateId, state)
  }

  getScrollPosition () {
    return (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0)
  }

  spyPosition () {
    this.setParameters()
    this.setNextAnchor()
  }

  getToSpyPositions () {
    return this.find('.spy-position')
  }

  setParameters () {
    const position = this.getScrollPosition()
    position > this.currentPosition ? this.direction = 0 : this.direction = 1
    this.currentPosition = position
  }

  setNextAnchor () {
    this.availableAnchor = this.toSpy.filter((key, item) => {
      return this.direction === 0
        ? item.offsetTop > this.currentPosition
          ? item
          : false
        : item.offsetTop < this.currentPosition
          ? item
          : false
    })
    if (!this.direction === 0) {
      this.availableAnchor = this.availableAnchor.get().reverse()
    }

    if (this.availableAnchor[0]) {
      if (this.direction === 0) {
        if (this.currentPosition > this.availableAnchor[0].offsetTop - 60) {
          this.toggleNavItemClass(this.availableAnchor[0])
        }
        if (this.currentPosition < this.availableAnchor[0].offsetTop + 60) {
          this.toggleNavItemClass(this.availableAnchor[0])
        }
      }
    } else if (!this.availableAnchor[0] &&
      (this.currentPosition < this.toSpy[0].offsetTop ||
      this.currentPosition > this.toSpy[this.toSpy.length - 1].offsetTop)) {
      this.toggleNavItemClass()
    }
  }

  toggleNavItemClass (item) {
    if (!item) {
      this.navButtons.removeClass('current')
    } else {
      const nextButton = this.navButtons.filter((key, button) => {
        return $(button).text().trim().toLowerCase() === item.id
      })

      const currentButton = this.navButtons.filter((key, button) => {
        return $(button).hasClass('current') === true
      })

      currentButton.removeClass('current')
      if (!nextButton.hasClass('current')) {
        $(nextButton).addClass('current')
      }
    }
  }

  init () {
    this.toSpy = this.getToSpyPositions()
    this.registerDomEvent(window, 'scroll', this.spyPosition.bind(this))
    this.registerDomEvent('.toggle-nav', 'click', this.handleButtonClick.bind(this))
    this.registerDomEvent('.nav-item', 'click', this.handleNavButtonsClick.bind(this))
    this.registerDomEvent('.footer-links li a', 'click', this.handleFooterlinksClick.bind(this))
  }
}
