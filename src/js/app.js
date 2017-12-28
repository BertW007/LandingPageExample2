import $ from "jquery";
import velocity from 'velocity-animate';
import '../scss/main.scss';

const handleOutlines = () => {
  const buttons = $('button'),
        links = $('a');

  $(window).on('keydown', (event) => {
    const key = event.keyCode;

    key === 9?
    (buttons.addClass('outline'), links.addClass('outline')):
    false;
  });
  $(window).on('click', (event) => {
    buttons.hasClass('outline')?
    (buttons.removeClass('outline'), links.removeClass('outline')):
    false;
  });
}

handleOutlines();

const handleNavSlide = () => {
  const nav = $('nav'),
        button = $('.toggle-nav'),
        buttonTopSpan = button.find('span:nth-child(1)'),
        buttonMidSpan = button.find('span:nth-child(2)'),
        buttonBottomSpan = button.find('span:nth-child(3)'),
        spans = [buttonTopSpan,buttonMidSpan,buttonBottomSpan];

  const animateButtonParts = () => {
    buttonTopSpan.velocity({translateY: '8px',rotateZ: '135deg'},{duration: 300});
    buttonMidSpan.velocity({translateX: '-40px',opacity: 0},{duration: 300});
    buttonBottomSpan.velocity({translateY: '-8px', rotateZ: '-135deg'},{duration: 300});
  }

  const reverseAnimateButtonParts = () => {
    spans.forEach((span) => {
      span.velocity('reverse');
    });
  }

  button.on('click', () => {
    const navDisplay = nav.css('display');
    const isVelocityAnimating = nav.hasClass('velocity-animating');

    navDisplay === 'none' && !isVelocityAnimating?
    (
      button.attr('aria-pressed','true'),
      button.addClass('nav-open'),
      nav.attr('aria-expanded', 'true'),
      animateButtonParts(),
      nav.velocity('slideDown', {duration: 500, easing: 'ease-in'})
    ):
    (
      button.attr('aria-pressed','false'),
      button.removeClass('nav-open'),
      nav.attr('aria-expanded', 'false'),
      reverseAnimateButtonParts(),
      nav.velocity('slideUp', {duration: 500, easing: 'ease-out'})
    );
  });
}

handleNavSlide();
