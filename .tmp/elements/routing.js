'use strict';

window.addEventListener('WebComponentsReady', function () {

  // We use Page.js for routing. This is a Micro
  // client-side router inspired by the Express router
  // More info: https://visionmedia.github.io/page.js/

  // Removes end / from app.baseUrl which page.base requires for production
  if (window.location.port === '') {
    // if production
    page.base(app.baseUrl.replace(/\/$/, ''));
  }

  // Middleware
  function scrollToTop(ctx, next) {
    app.scrollPageToTop();
    next();
  }

  function closeDrawer(ctx, next) {
    app.closeDrawer();
    next();
  }

  function setFocus(selected) {
    document.querySelector('section[data-route="' + selected + '"] .page-title').focus();
  }

  // Routes
  page('*', scrollToTop, closeDrawer, function (ctx, next) {
    next();
  });

  page('/', function () {
    app.route = 'home';
    setFocus(app.route);
  });

  page(app.baseUrl, function () {
    app.route = 'home';
    setFocus(app.route);
  });

  page('/users', function () {
    app.route = 'users';
    setFocus(app.route);
  });

  page('/users/:name', function (data) {
    app.route = 'user-info';
    app.params = data.params;
    setFocus(app.route);
  });

  page('/contact', function () {
    app.route = 'contact';
    setFocus(app.route);
  });

  // 404
  page('*', function () {
    app.$.toast.text = 'Can\'t find: ' + window.location.href + '. Redirected you to Home Page';
    app.$.toast.show();
    page.redirect(app.baseUrl);
  });

  // add #! before urls
  page({
    hashbang: true
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL3JvdXRpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLGdCQUFQLENBQXdCLG9CQUF4QixFQUE4QyxZQUFXOztBQUVyRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFJLE9BQU8sUUFBUCxDQUFnQixJQUFoQixLQUF5QixFQUE3QixFQUFpQztBQUFHO0FBQ2xDLFNBQUssSUFBTCxDQUFVLElBQUksT0FBSixDQUFZLE9BQVosQ0FBb0IsS0FBcEIsRUFBMkIsRUFBM0IsQ0FBVjtBQUNEOztBQUVEO0FBQ0EsV0FBUyxXQUFULENBQXFCLEdBQXJCLEVBQTBCLElBQTFCLEVBQWdDO0FBQzlCLFFBQUksZUFBSjtBQUNBO0FBQ0Q7O0FBRUQsV0FBUyxXQUFULENBQXFCLEdBQXJCLEVBQTBCLElBQTFCLEVBQWdDO0FBQzlCLFFBQUksV0FBSjtBQUNBO0FBQ0Q7O0FBRUQsV0FBUyxRQUFULENBQWtCLFFBQWxCLEVBQTJCO0FBQ3pCLGFBQVMsYUFBVCxDQUF1Qix5QkFBeUIsUUFBekIsR0FBb0MsZ0JBQTNELEVBQTZFLEtBQTdFO0FBQ0Q7O0FBRUQ7QUFDQSxPQUFLLEdBQUwsRUFBVSxXQUFWLEVBQXVCLFdBQXZCLEVBQW9DLFVBQVMsR0FBVCxFQUFjLElBQWQsRUFBb0I7QUFDdEQ7QUFDRCxHQUZEOztBQUlBLE9BQUssR0FBTCxFQUFVLFlBQVc7QUFDbkIsUUFBSSxLQUFKLEdBQVksTUFBWjtBQUNBLGFBQVMsSUFBSSxLQUFiO0FBQ0QsR0FIRDs7QUFLQSxPQUFLLElBQUksT0FBVCxFQUFrQixZQUFXO0FBQzNCLFFBQUksS0FBSixHQUFZLE1BQVo7QUFDQSxhQUFTLElBQUksS0FBYjtBQUNELEdBSEQ7O0FBS0EsT0FBSyxRQUFMLEVBQWUsWUFBVztBQUN4QixRQUFJLEtBQUosR0FBWSxPQUFaO0FBQ0EsYUFBUyxJQUFJLEtBQWI7QUFDRCxHQUhEOztBQUtBLE9BQUssY0FBTCxFQUFxQixVQUFTLElBQVQsRUFBZTtBQUNsQyxRQUFJLEtBQUosR0FBWSxXQUFaO0FBQ0EsUUFBSSxNQUFKLEdBQWEsS0FBSyxNQUFsQjtBQUNBLGFBQVMsSUFBSSxLQUFiO0FBQ0QsR0FKRDs7QUFNQSxPQUFLLFVBQUwsRUFBaUIsWUFBVztBQUMxQixRQUFJLEtBQUosR0FBWSxTQUFaO0FBQ0EsYUFBUyxJQUFJLEtBQWI7QUFDRCxHQUhEOztBQUtBO0FBQ0EsT0FBSyxHQUFMLEVBQVUsWUFBVztBQUNuQixRQUFJLENBQUosQ0FBTSxLQUFOLENBQVksSUFBWixHQUFtQixrQkFBa0IsT0FBTyxRQUFQLENBQWdCLElBQWxDLEdBQTBDLCtCQUE3RDtBQUNBLFFBQUksQ0FBSixDQUFNLEtBQU4sQ0FBWSxJQUFaO0FBQ0EsU0FBSyxRQUFMLENBQWMsSUFBSSxPQUFsQjtBQUNELEdBSkQ7O0FBTUE7QUFDQSxPQUFLO0FBQ0gsY0FBVTtBQURQLEdBQUw7QUFJRCxDQXJFSCIsImZpbGUiOiJlbGVtZW50cy9yb3V0aW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsid2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ1dlYkNvbXBvbmVudHNSZWFkeScsIGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gV2UgdXNlIFBhZ2UuanMgZm9yIHJvdXRpbmcuIFRoaXMgaXMgYSBNaWNyb1xuICAgIC8vIGNsaWVudC1zaWRlIHJvdXRlciBpbnNwaXJlZCBieSB0aGUgRXhwcmVzcyByb3V0ZXJcbiAgICAvLyBNb3JlIGluZm86IGh0dHBzOi8vdmlzaW9ubWVkaWEuZ2l0aHViLmlvL3BhZ2UuanMvXG5cbiAgICAvLyBSZW1vdmVzIGVuZCAvIGZyb20gYXBwLmJhc2VVcmwgd2hpY2ggcGFnZS5iYXNlIHJlcXVpcmVzIGZvciBwcm9kdWN0aW9uXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wb3J0ID09PSAnJykgeyAgLy8gaWYgcHJvZHVjdGlvblxuICAgICAgcGFnZS5iYXNlKGFwcC5iYXNlVXJsLnJlcGxhY2UoL1xcLyQvLCAnJykpO1xuICAgIH1cblxuICAgIC8vIE1pZGRsZXdhcmVcbiAgICBmdW5jdGlvbiBzY3JvbGxUb1RvcChjdHgsIG5leHQpIHtcbiAgICAgIGFwcC5zY3JvbGxQYWdlVG9Ub3AoKTtcbiAgICAgIG5leHQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZURyYXdlcihjdHgsIG5leHQpIHtcbiAgICAgIGFwcC5jbG9zZURyYXdlcigpO1xuICAgICAgbmV4dCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldEZvY3VzKHNlbGVjdGVkKXtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NlY3Rpb25bZGF0YS1yb3V0ZT1cIicgKyBzZWxlY3RlZCArICdcIl0gLnBhZ2UtdGl0bGUnKS5mb2N1cygpO1xuICAgIH1cblxuICAgIC8vIFJvdXRlc1xuICAgIHBhZ2UoJyonLCBzY3JvbGxUb1RvcCwgY2xvc2VEcmF3ZXIsIGZ1bmN0aW9uKGN0eCwgbmV4dCkge1xuICAgICAgbmV4dCgpO1xuICAgIH0pO1xuXG4gICAgcGFnZSgnLycsIGZ1bmN0aW9uKCkge1xuICAgICAgYXBwLnJvdXRlID0gJ2hvbWUnO1xuICAgICAgc2V0Rm9jdXMoYXBwLnJvdXRlKTtcbiAgICB9KTtcblxuICAgIHBhZ2UoYXBwLmJhc2VVcmwsIGZ1bmN0aW9uKCkge1xuICAgICAgYXBwLnJvdXRlID0gJ2hvbWUnO1xuICAgICAgc2V0Rm9jdXMoYXBwLnJvdXRlKTtcbiAgICB9KTtcblxuICAgIHBhZ2UoJy91c2VycycsIGZ1bmN0aW9uKCkge1xuICAgICAgYXBwLnJvdXRlID0gJ3VzZXJzJztcbiAgICAgIHNldEZvY3VzKGFwcC5yb3V0ZSk7XG4gICAgfSk7XG5cbiAgICBwYWdlKCcvdXNlcnMvOm5hbWUnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBhcHAucm91dGUgPSAndXNlci1pbmZvJztcbiAgICAgIGFwcC5wYXJhbXMgPSBkYXRhLnBhcmFtcztcbiAgICAgIHNldEZvY3VzKGFwcC5yb3V0ZSk7XG4gICAgfSk7XG5cbiAgICBwYWdlKCcvY29udGFjdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXBwLnJvdXRlID0gJ2NvbnRhY3QnO1xuICAgICAgc2V0Rm9jdXMoYXBwLnJvdXRlKTtcbiAgICB9KTtcblxuICAgIC8vIDQwNFxuICAgIHBhZ2UoJyonLCBmdW5jdGlvbigpIHtcbiAgICAgIGFwcC4kLnRvYXN0LnRleHQgPSAnQ2FuXFwndCBmaW5kOiAnICsgd2luZG93LmxvY2F0aW9uLmhyZWYgICsgJy4gUmVkaXJlY3RlZCB5b3UgdG8gSG9tZSBQYWdlJztcbiAgICAgIGFwcC4kLnRvYXN0LnNob3coKTtcbiAgICAgIHBhZ2UucmVkaXJlY3QoYXBwLmJhc2VVcmwpO1xuICAgIH0pO1xuXG4gICAgLy8gYWRkICMhIGJlZm9yZSB1cmxzXG4gICAgcGFnZSh7XG4gICAgICBoYXNoYmFuZzogdHJ1ZVxuICAgIH0pO1xuXG4gIH0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
