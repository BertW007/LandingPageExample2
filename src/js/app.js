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
    const isVelocityAnimating = nav.hasClass('velocity-animating');
    const isNavOpen = button.hasClass('nav-open');

    !isNavOpen && !isVelocityAnimating?
    (
      button.attr('aria-pressed','true'),
      button.addClass('nav-open'),
      nav.attr('aria-expanded', 'true'),
      nav.velocity('slideDown', {duration: 500, easing: 'ease-in', begin: animateButtonParts})
    ):
    (
      button.attr('aria-pressed','false'),
      button.removeClass('nav-open'),
      nav.attr('aria-expanded', 'false'),
      nav.velocity('slideUp', {duration: 500, easing: 'ease-out', begin: reverseAnimateButtonParts})
    );
  });
}

handleNavSlide();

const handleNavButtonsScrollToTarget = () => {
  const navItems = $('.nav-item');

  const scrollToTarget = (item) => {
    const target = item.innerText.trim().toLowerCase();
    $(item).on('click',() => {
      $('#' + target).velocity('scroll', {duration: 2000, easing: 'ease-out' });
    });
  }

  navItems.each((key,item) => {
    scrollToTarget(item);
  });
}

handleNavButtonsScrollToTarget();

const handleEmailAddress = () => {
  const mail = $('.contact-email');
  const adr = mail.text().trim().toLowerCase().replace('(at)', '@').replace(/\(dot\)/g, '.');
  mail.text(adr);
}

handleEmailAddress();
