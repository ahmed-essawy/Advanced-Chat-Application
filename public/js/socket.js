'use strict';

var mentionedSound = new Audio("peep.mp3"); // buffers automatically when created
var currentUser;

$(function () {
  let socket = io('/', { transports: ['websocket'] });
  socket.on('connect', function () {
    socket.on('Set User', user => currentUser = user);
    socket.on('User Joined', user => {
      if ($('#onlineUser-' + user._id).length === 0) {
        $('#userlist-content').append('<div class="user" id="onlineUser-' + user._id + '"><div class="profilepic"><img src="' + user.picture + '" alt=""></div><div class="username ' + user.role + '">' + user.username + '</div><div class="rank">' + user.role + '</div></div>');
        let onlineCount = parseInt($("#onlineCount1").text());
        $("#onlineCount1").text(onlineCount + 1)
        $("#onlineCount2").text(onlineCount + 1)
      }
      if ($('#usersList-' + user._id).length === 0) {
        $('#waitlist-content').append('<div class="queue-user" id="usersList-' + user._id + '"><div class="profilepic"><img src="' + user.picture + '" alt=""></div><div class="username ' + user.role + '">' + user.username + '</div><div class="actions"><div class="moveUser"><i class="mdi mdi-24px mdi-drag"></i></div></div></div>');
        $("#usersCount").text(parseInt($("#usersCount").text()) + 1);
      }
      if ($("#staffUserlist-content #staffUser-" + user._id).length === 0) {
        $("#staffUserlist-content").append('<div class="user" id="staffUser-' + user._id + '"><div class="profilepic"><img src="' + user.picture + '" alt=""></div><div class="username ' + user.role + '">' + user.username + '</div><div class="actions"><div class="rank">' + user.role + '</div></div></div>');
        $("#staffUserCount").text(parseInt($("#staffUserCount").text()) + 1);
      }
    });
    socket.on('User Left', userId => {
      if ($('#onlineUser-' + userId).length > 0) {
        $('#onlineUser-' + userId).remove();
        let onlineCount = parseInt($("#onlineCount1").text());
        $("#onlineCount1").text(onlineCount - 1)
        $("#onlineCount2").text(onlineCount - 1)
      }
    });
    socket.on('Comming Message', data => {
      var chatContent = document.getElementById("chat-content");
      var canDelete = currentUser.role === "Owner" || currentUser.role === "Manager" || currentUser.role === "Moderator";
      var deleteIcon = canDelete ? "<i id=\"deleteMsgButton\" class=\"mdi mdi-24px mdi-close\" style=\"float: right; cursor: pointer\"></i>" : "";
      if (data.sender.role === "Owner" || (data.sender.role === "Manager" && currentUser.role === "Moderator")) deleteIcon = "";
      chatContent.innerHTML += "<div id=\"" + data.id + "\" class=\"msg\"><div class=\"header\">\
    <div class=\"profilepic\"><img src=\""+ data.sender.picture + "\" alt=\"\"></div>\
    <div class=\"username "+ data.sender.role + "\">" + data.sender.username + "</div>" + deleteIcon + "\
    <div class=\"time\">"+ data.date + "</div></div>\
    <div class=\"message\"><p>"+ data.message + "</p></div></div>";
      chatContent.scrollTop = chatContent.scrollHeight;
    });
    socket.on('Comming Sound', () => mentionedSound.play());
    socket.on('Delete Message', msgId => $("#" + msgId).remove());
    $("body").on("keydown", "[id^=mentiony-content-]", function (event) {
      if (event.keyCode == 13 && $("[id^=mentiony-content-]").text() !== "" && $('[id^=mentiony-popover-]').css('display') === 'none') {
        var mentions = $("[id^=mentiony-content-] .mention-area");
        for (var i = 0; i < mentions.length; ++i) socket.emit('Message Sound', $(mentions[i]).text().substring(1));
        var chatMessage = $("[id^=mentiony-content-]").text().replace(/(@\w+)/g, "<span class='chat-highlight'>$1</span>");
        socket.emit('New Message', chatMessage);
        $("[id^=mentiony-content-]").html("")
      }
    });
    $("body").on("click", "#deleteMsgButton", function (event) {
      socket.emit('Delete Message', $(this).parent().parent().attr('id'));
    });
  });
});

function editStaffRole(element) {
  $(element).parent(".actions").siblings("#staffUserRole").show();
  $(element).parent(".actions").hide();
}

function changeStaffRole(element, userId) {
  $.post("/user/role", { userId: userId, role: $(element).val() })
    .done(function () {
      $(element).parent("#staffUserRole").siblings(".actions").children(".rank").text($(element).val());
      $(element).parent("#staffUserRole").siblings(".actions").show();
      $(element).parent("#staffUserRole").hide();
    });
}

function cancelChangeStaffRole(element) {
  $(element).parent("#staffUserRole").siblings(".actions").children(".rank").text($(element).siblings("select").val());
  $(element).parent("#staffUserRole").siblings(".actions").show();
  $(element).parent("#staffUserRole").hide();
}

function banUser(element, user, type, state) {
  if (type === 'User') {
    $.post("/user/block", { userId: user.id, isBlocked: state });
    if (state) {
      if ($("#staffBanlist-content #bannedUser-" + user.id).length === 0) {
        $("#staffBanlist-content").append('<div class="user" id="bannedUser-' + user.id + '"><div class="profilepic"><img src="' + user.picture + '" alt=""></div>\
      <div class="username '+ user.role + '">' + user.username + '</div><div class="actions"><div class="rank">' + user.role + '</div>\
      <div class="removeBan" onclick="banUser(this, { id: \'' + user.id + '\', username:\'' + user.username + '\', picture:\'' + user.picture + '\', role:\'' + user.role + '\' }, \'User\', false)"><i class="mdi mdi-24px mdi-close"></i></div></div></div>');
        $("#bannedCount").text(parseInt($("#bannedCount").text()) + 1);
        $("#staffUserCount").text(parseInt($("#staffUserCount").text()) - 1);
        $("#staffUser-" + user.id).remove();
      }
    } else {
      if ($("#staffUserlist-content #staffUser-" + user.id).length === 0) {
        $("#staffUserlist-content").append('<div class="user" id="staffUser-' + user.id + '"><div class="profilepic"><img src="' + user.picture + '" alt=""></div><div class="username ' + user.role + '">' + user.username + '</div><div class="actions"><div class="rank">' + user.role + '</div></div></div>');
        $("#staffBanlist-content #bannedUser-" + user.id).remove();
        $("#bannedCount").text(parseInt($("#bannedCount").text()) - 1);
        $("#staffUserCount").text(parseInt($("#staffUserCount").text()) + 1);
      }
    }
  }
  else if (type === 'IP')
    $.post("/blockIP", { userId: user, state: state });
}

function muteUser(element, user, state) {
  $.post("/user/mute", { userId: user.id, isMuted: state });
  if (state) {
    if ($("#staffMutelist-content #mutedUser-" + user.id).length === 0) {
      $("#staffMutelist-content").append('<div class="user" id="mutedUser-' + user.id + '"><div class="profilepic"><img src="' + user.picture + '" alt=""></div>\
    <div class="username '+ user.role + '">' + user.username + '</div><div class="actions"><div class="rank">' + user.role + '</div>\
    <div class="removeMute" onclick="muteUser(this, { id: \'' + user.id + '\', username:\'' + user.username + '\', picture:\'' + user.picture + '\', role:\'' + user.role + '\' }, false)"><i class="mdi mdi-24px mdi-volume-mute"></i></div></div></div>');
      $("#mutedCount").text(parseInt($("#mutedCount").text()) + 1);
      $("#staffUserCount").text(parseInt($("#staffUserCount").text()) - 1);
      $("#staffUser-" + user.id).remove();
    }
  } else {
    if ($("#staffUserlist-content #staffUser-" + user.id).length === 0) {
      $("#staffUserlist-content").append('<div class="user" id="staffUser-' + user.id + '"><div class="profilepic"><img src="' + user.picture + '" alt=""></div><div class="username ' + user.role + '">' + user.username + '</div><div class="actions"><div class="rank">' + user.role + '</div></div></div>');
      $("#staffMutelist-content #mutedUser-" + user.id).remove();
      $("#mutedCount").text(parseInt($("#mutedCount").text()) - 1);
      $("#staffUserCount").text(parseInt($("#staffUserCount").text()) + 1);
    }
  }
}

$("#chat-input-field").mentiony({
  onDataRequest: function (mode, keyword, onDataRequestCompleteCallback) {
    $.ajax({
      method: "POST",
      url: "/mention",
      data: { term: keyword },
      dataType: "json",
      success: function (response) {
        var data = response;
        // NOTE: Assuming this filter process was done on server-side
        data = jQuery.grep(data, function (item) {
          item.id = item._id;
          item.name = item.username;
          item.avatar = item.picture;
          item.info = item.role;
          return item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
        });
        // End server-side
        // Call this to populate mention.
        onDataRequestCompleteCallback.call(this, data);
      }
    });

  },
  timeOut: 500,
});