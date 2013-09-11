// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    var button, emailInput, errorAlert, hideAll, loader, passwordInput, submitCredentials, successAlert,
      _this = this;
    loader = $('.loading');
    passwordInput = $('#password-input');
    emailInput = $('#email-input');
    errorAlert = $('.alert-error');
    successAlert = $('.alert-success');
    button = $('#submit-btn');
    hideAll = function() {
      return wait(1000, function() {
        var _this = this;
        return progFadeOut([$($('h1')[0]), $($('h1')[1]), $($('h1')[2]), emailInput, passwordInput, button, successAlert], function() {
          $('img').fadeOut();
          return wait(100, function() {
            return window.location = "/";
          });
        });
      });
    };
    submitCredentials = function() {
      errorAlert.fadeOut();
      loader.spin('small');
      button.spin('small');
      return client.post("register/", {
        password: passwordInput.val(),
        email: emailInput.val()
      }, {
        success: function() {
          loader.spin();
          button.spin();
          button.html('send informations');
          successAlert.fadeIn();
          return hideAll();
        },
        error: function(err) {
          var msg;
          loader.spin();
          button.spin();
          button.html('send informations');
          msg = JSON.parse(err.responseText).msg;
          errorAlert.html(msg);
          return errorAlert.fadeIn();
        }
      });
    };
    emailInput.keyup(function(event) {
      if (event.which === 13) {
        return passwordInput.focus();
      }
    });
    passwordInput.keyup(function(event) {
      if (event.which === 13) {
        return submitCredentials();
      }
    });
    button.click(submitCredentials);
    $('h1').hide();
    $('input').hide();
    button.hide();
    return progFadeIn([$($('h1')[0]), $($('h1')[1]), $($('h1')[2]), emailInput, passwordInput, button], function() {
      return $('#email-input').focus();
    });
  });

}).call(this);
