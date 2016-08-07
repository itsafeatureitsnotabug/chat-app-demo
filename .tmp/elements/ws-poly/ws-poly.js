'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var store = void 0;
var _socketId = null;
var _socketMsg = null;
var _socketURL = null;
var MAX_MSG_HISTORY = 20;

/* TODO: create the Polymer element's definition in ES2015 */

var WebsocketsRedux = function () {
  function WebsocketsRedux() {
    _classCallCheck(this, WebsocketsRedux);
  }

  _createClass(WebsocketsRedux, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.is = 'ws-poly';

      this.properties = {};
    }
  }, {
    key: 'created',
    value: function created() {
      // Define All Actions 
      this.wsMessageActions = {
        sendWsMsg: function sendWsMsg(ws, wsMessage) {
          return {
            type: 'SEND_WS_MESSAGE',
            wsId: ws,
            wsMsg: wsMessage
          };
        },
        connectWs: function connectWs(ws, url) {
          return {
            type: 'CONNECT_WS',
            wsId: ws,
            wsUrl: url
          };
        },
        disconnectWs: function disconnectWs(ws) {
          return {
            type: 'DISCONNECT_WS',
            wsId: ws
          };
        }
      };
    }
  }, {
    key: 'ready',
    value: function ready() {
      var that = this;
      // Initialize  Redux  Store
      function msgReducer() {
        var state = arguments.length <= 0 || arguments[0] === undefined ? Immutable.Map({
          wsId: null,
          wsUrl: '',
          wsMsg: ''
        }) : arguments[0];
        var action = arguments[1];


        switch (action.type) {
          case 'SEND_WS_MESSAGE':
            action.wsId.send(action.wsMsg);
            return {
              wsId: action.wsId,
              wsUrl: '',
              wsMsg: action.wsMsg
            };
            break;

          case 'CONNECT_WS':
            return {
              wsId: new WebSocket(action.wsUrl),
              wsUrl: action.wsUrl,
              wsMsg: ''
            };
            break;

          case 'DISCONNECT_WS':
            action.wsId.close();
            return {
              wsId: null,
              wsUrl: '',
              wsMsg: ''
            };
            break;

          default:
            return state;
        }
      }

      // Define App as combination of all reducers
      var wsReduxApp = Redux.combineReducers({
        msgReducer: msgReducer
      });
      var initialState = Immutable.List.of();

      // Create Store
      store = Redux.createStore(msgReducer, initialState);

      // Subscribe Variables
      store.subscribe(function () {
        _socketId = store.getState().wsId;
        _socketMsg = store.getState().wsMsg;
        _socketURL = store.getState().wsUrl;
      });
    }
  }, {
    key: 'attached',
    value: function attached() {
      var that = this;
      // that.connectSocket();
    }
  }, {
    key: 'connectSocket',
    value: function connectSocket() {
      var that = this;
      var protocol = "ws://";
      console.log("Arrived at connectSocket.");

      if (_socketId != null) {
        that.updateTextBox("Websocket already active brah !");
        return;
      }

      if (window.location.protocol == "https:") {
        protocol = "wss://";
      }
      var urlValue = protocol + document.getElementById('websocket-url').value + "/";

      store.dispatch(that.wsMessageActions.connectWs(_socketId, urlValue));

      _socketId.addEventListener("open", function (event) {
        that.updateTextBox(" Socket Connected ! ");
      });

      // Display messages received from the server
      _socketId.addEventListener("message", function (event) {
        that.updateTextBox("WS Server Says: " + event.data);
      });

      // Display any errors that occur
      _socketId.addEventListener("error", function (event) {
        that.updateTextBox(" Socket ERRORRRRRR ");
      });

      _socketId.addEventListener("close", function (event) {
        store.dispatch(that.wsMessageActions.disconnectWs(_socketId));
        that.updateTextBox(" Socket CLOSED !!!!!!!! ");
      });
    }
  }, {
    key: 'disconnectSocket',
    value: function disconnectSocket() {
      var that = this;
      console.log("Closing message over socket");

      if (_socketId === null) {
        that.updateTextBox("WARNING : No Active Socket Connection Detected !");
        return;
      }
      store.dispatch(that.wsMessageActions.disconnectWs(_socketId));
      that.updateTextBox("Web Socket Connection Closed at :" + Date.now().toString());
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage() {
      var that = this;
      console.log("Sending message over socket");

      if (_socketId === null) {
        that.updateTextBox("WARNING : No Active Socket Connection Detected !");
        return;
      }

      var chatMessage = document.getElementById('chat-msg').value;
      var socketPayload = "Message :" + chatMessage + " | Sent at :" + Date.now().toString();

      store.dispatch(that.wsMessageActions.sendWsMsg(_socketId, socketPayload));
      that.updateTextBox("Client Says: " + socketPayload);
    }
  }, {
    key: 'updateTextBox',
    value: function updateTextBox(msg) {
      if (message.textContent.split(/\r*\n/).length >= MAX_MSG_HISTORY) {
        message.textContent = '';
      }
      message.textContent = msg + "\n" + message.textContent;
    }
  }]);

  return WebsocketsRedux;
}();

Polymer(WebsocketsRedux);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL3dzLXBvbHkvd3MtcG9seS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFJLGNBQUo7QUFDSSxJQUFJLFlBQWMsSUFBbEI7QUFDQSxJQUFJLGFBQWMsSUFBbEI7QUFDQSxJQUFJLGFBQWMsSUFBbEI7QUFDQSxJQUFNLGtCQUFrQixFQUF4Qjs7QUFHQTs7SUFDTSxlOzs7Ozs7O3FDQUVhO0FBQ2YsV0FBSyxFQUFMLEdBQVUsU0FBVjs7QUFFQSxXQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFFRDs7OzhCQUVTO0FBQ1I7QUFDQSxXQUFLLGdCQUFMLEdBQXdCO0FBQ3RCLG1CQUFXLG1CQUFDLEVBQUQsRUFBSyxTQUFMLEVBQW1CO0FBQzVCLGlCQUFPO0FBQ0wsa0JBQU0saUJBREQ7QUFFTCxrQkFBTSxFQUZEO0FBR0wsbUJBQU87QUFIRixXQUFQO0FBS0QsU0FQcUI7QUFRdEIsbUJBQVcsbUJBQUMsRUFBRCxFQUFLLEdBQUwsRUFBYTtBQUN0QixpQkFBTztBQUNMLGtCQUFNLFlBREQ7QUFFTCxrQkFBTSxFQUZEO0FBR0wsbUJBQU87QUFIRixXQUFQO0FBS0QsU0FkcUI7QUFldEIsc0JBQWMsc0JBQUMsRUFBRCxFQUFRO0FBQ3BCLGlCQUFPO0FBQ0wsa0JBQU0sZUFERDtBQUVMLGtCQUFNO0FBRkQsV0FBUDtBQUlEO0FBcEJxQixPQUF4QjtBQXNCRDs7OzRCQUVPO0FBQ04sVUFBSSxPQUFPLElBQVg7QUFDQTtBQUNBLGVBQVMsVUFBVCxHQUlhO0FBQUEsWUFKTyxLQUlQLHlEQUplLFVBQVUsR0FBVixDQUFjO0FBQ3hDLGdCQUFTLElBRCtCO0FBRXhDLGlCQUFTLEVBRitCO0FBR3hDLGlCQUFTO0FBSCtCLFNBQWQsQ0FJZjtBQUFBLFlBQVAsTUFBTzs7O0FBRVgsZ0JBQVEsT0FBTyxJQUFmO0FBQ0UsZUFBSyxpQkFBTDtBQUNFLG1CQUFPLElBQVAsQ0FBWSxJQUFaLENBQWlCLE9BQU8sS0FBeEI7QUFDQSxtQkFBTztBQUNM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YUFBSyxhQUFMLENBQW1CLGtEQUFuQjtBQUNBO0FBQ0Q7O0FBRUQsVUFBSSxjQUFjLFNBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQyxLQUF0RDtBQUNBLFVBQUksZ0JBQWdCLGNBQWMsV0FBZCxHQUE2QixjQUE3QixHQUE4QyxLQUFLLEdBQUwsR0FBVyxRQUFYLEVBQWxFOztBQUVBLFlBQU0sUUFBTixDQUNFLEtBQUssZ0JBQUwsQ0FBc0IsU0FBdEIsQ0FBaUMsU0FBakMsRUFBNkMsYUFBN0MsQ0FERjtBQUdBLFdBQUssYUFBTCxDQUFtQixrQkFBa0IsYUFBckM7QUFDRDs7O2tDQUVhLEcsRUFBSztBQUNqQixVQUFLLFFBQVEsV0FBUixDQUFvQixLQUFwQixDQUEwQixPQUExQixFQUFtQyxNQUFuQyxJQUE2QyxlQUFsRCxFQUFvRTtBQUNsRSxnQkFBUSxXQUFSLEdBQXNCLEVBQXRCO0FBQ0Q7QUFDRCxjQUFRLFdBQVIsR0FBc0IsTUFBTSxJQUFOLEdBQWEsUUFBUSxXQUEzQztBQUNEOzs7Ozs7QUFHSCxRQUFRLGVBQVIiLCJmaWxlIjoiZWxlbWVudHMvd3MtcG9seS93cy1wb2x5LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IHN0b3JlO1xuICAgIGxldCBfc29ja2V0SWQgICA9IG51bGw7XG4gICAgbGV0IF9zb2NrZXRNc2cgID0gbnVsbDtcbiAgICBsZXQgX3NvY2tldFVSTCAgPSBudWxsO1xuICAgIGNvbnN0IE1BWF9NU0dfSElTVE9SWSA9IDIwO1xuXG5cbiAgICAvKiBUT0RPOiBjcmVhdGUgdGhlIFBvbHltZXIgZWxlbWVudCdzIGRlZmluaXRpb24gaW4gRVMyMDE1ICovXG4gICAgY2xhc3MgV2Vic29ja2V0c1JlZHV4IHtcblxuICAgICAgYmVmb3JlUmVnaXN0ZXIoKSB7XG4gICAgICAgIHRoaXMuaXMgPSAnd3MtcG9seSc7XG5cbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0ge1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBjcmVhdGVkKCkge1xuICAgICAgICAvLyBEZWZpbmUgQWxsIEFjdGlvbnMgXG4gICAgICAgIHRoaXMud3NNZXNzYWdlQWN0aW9ucyA9IHtcbiAgICAgICAgICBzZW5kV3NNc2c6ICh3cywgd3NNZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB0eXBlOiAnU0VORF9XU19NRVNTQUdFJyxcbiAgICAgICAgICAgICAgd3NJZDogd3MsXG4gICAgICAgICAgICAgIHdzTXNnOiB3c01lc3NhZ2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb25uZWN0V3M6ICh3cywgdXJsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB0eXBlOiAnQ09OTkVDVF9XUycsXG4gICAgICAgICAgICAgIHdzSWQ6IHdzLFxuICAgICAgICAgICAgICB3c1VybDogdXJsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGlzY29ubmVjdFdzOiAod3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdESVNDT05ORUNUX1dTJyxcbiAgICAgICAgICAgICAgd3NJZDogd3NcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmVhZHkoKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSAgUmVkdXggIFN0b3JlXG4gICAgICAgIGZ1bmN0aW9uIG1zZ1JlZHVjZXIoc3RhdGUgPSBJbW11dGFibGUuTWFwKHtcbiAgICAgICAgICB3c0lkICAgOiBudWxsLFxuICAgICAgICAgIHdzVXJsICA6ICcnLFxuICAgICAgICAgIHdzTXNnICA6ICcnXG4gICAgICAgICAgfSksIGFjdGlvbil7XG5cbiAgICAgICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdTRU5EX1dTX01FU1NBR0UnOlxuICAgICAgICAgICAgICBhY3Rpb24ud3NJZC5zZW5kKGFjdGlvbi53c01zZyk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd3NJZCAgIDogYWN0aW9uLndzSWQsXG4gICAgICAgICAgICAgICAgd3NVcmwgIDogJycsXG4gICAgICAgICAgICAgICAgd3NNc2cgIDogYWN0aW9uLndzTXNnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ0NPTk5FQ1RfV1MnOlxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd3NJZCAgIDogbmV3IFdlYlNvY2tldChhY3Rpb24ud3NVcmwpLFxuICAgICAgICAgICAgICAgIHdzVXJsICA6IGFjdGlvbi53c1VybCxcbiAgICAgICAgICAgICAgICB3c01zZyAgOiAnJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdESVNDT05ORUNUX1dTJzpcbiAgICAgICAgICAgICAgYWN0aW9uLndzSWQuY2xvc2UoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB3c0lkICAgOiBudWxsLFxuICAgICAgICAgICAgICAgIHdzVXJsICA6ICcnLFxuICAgICAgICAgICAgICAgIHdzTXNnICA6ICcnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHJldHVybiBzdGF0ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlZmluZSBBcHAgYXMgY29tYmluYXRpb24gb2YgYWxsIHJlZHVjZXJzXG4gICAgICAgIGNvbnN0IHdzUmVkdXhBcHAgPSBSZWR1eC5jb21iaW5lUmVkdWNlcnMoe1xuICAgICAgICAgIG1zZ1JlZHVjZXJcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGluaXRpYWxTdGF0ZSA9IEltbXV0YWJsZS5MaXN0Lm9mKCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIFN0b3JlXG4gICAgICAgIHN0b3JlID0gUmVkdXguY3JlYXRlU3RvcmUobXNnUmVkdWNlciwgaW5pdGlhbFN0YXRlKTtcblxuICAgICAgICAvLyBTdWJzY3JpYmUgVmFyaWFibGVzXG4gICAgICAgIHN0b3JlLnN1YnNjcmliZShmdW5jdGlvbigpe1xuICAgICAgICAgIF9zb2NrZXRJZCAgID0gc3RvcmUuZ2V0U3RhdGUoKS53c0lkO1xuICAgICAgICAgIF9zb2NrZXRNc2cgID0gc3RvcmUuZ2V0U3RhdGUoKS53c01zZztcbiAgICAgICAgICBfc29ja2V0VVJMICA9IHN0b3JlLmdldFN0YXRlKCkud3NVcmw7XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGF0dGFjaGVkKCl7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgLy8gdGhhdC5jb25uZWN0U29ja2V0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbm5lY3RTb2NrZXQoKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgbGV0IHByb3RvY29sID0gXCJ3czovL1wiO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFycml2ZWQgYXQgY29ubmVjdFNvY2tldC5cIik7XG5cbiAgICAgICAgaWYgKF9zb2NrZXRJZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhhdC51cGRhdGVUZXh0Qm94KFwiV2Vic29ja2V0IGFscmVhZHkgYWN0aXZlIGJyYWggIVwiKTtcbiAgICAgICAgICByZXR1cm4gO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZih3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT0gXCJodHRwczpcIikge1xuICAgICAgICAgIHByb3RvY29sID0gXCJ3c3M6Ly9cIjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdXJsVmFsdWUgPSBwcm90b2NvbCArIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWJzb2NrZXQtdXJsJykudmFsdWUgKyBcIi9cIjtcbiAgICAgICAgXG5cbiAgICAgICAgc3RvcmUuZGlzcGF0Y2goXG4gICAgICAgICAgdGhhdC53c01lc3NhZ2VBY3Rpb25zLmNvbm5lY3RXcyhfc29ja2V0SWQsIHVybFZhbHVlKVxuICAgICAgICAgIClcblxuICAgICAgICBfc29ja2V0SWQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICB0aGF0LnVwZGF0ZVRleHRCb3goXCIgU29ja2V0IENvbm5lY3RlZCAhIFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRGlzcGxheSBtZXNzYWdlcyByZWNlaXZlZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgICAgX3NvY2tldElkLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgdGhhdC51cGRhdGVUZXh0Qm94KFwiV1MgU2VydmVyIFNheXM6IFwiICsgZXZlbnQuZGF0YSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIERpc3BsYXkgYW55IGVycm9ycyB0aGF0IG9jY3VyXG4gICAgICAgIF9zb2NrZXRJZC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICB0aGF0LnVwZGF0ZVRleHRCb3goXCIgU29ja2V0IEVSUk9SUlJSUlIgXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBfc29ja2V0SWQuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgc3RvcmUuZGlzcGF0Y2goXG4gICAgICAgICAgICB0aGF0LndzTWVzc2FnZUFjdGlvbnMuZGlzY29ubmVjdFdzKF9zb2NrZXRJZClcbiAgICAgICAgICApXG4gICAgICAgICAgdGhhdC51cGRhdGVUZXh0Qm94KFwiIFNvY2tldCBDTE9TRUQgISEhISEhISEgXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZGlzY29ubmVjdFNvY2tldCgpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNsb3NpbmcgbWVzc2FnZSBvdmVyIHNvY2tldFwiKTtcblxuICAgICAgICBpZihfc29ja2V0SWQgPT09IG51bGwgKSB7XG4gICAgICAgICAgdGhhdC51cGRhdGVUZXh0Qm94KFwiV0FSTklORyA6IE5vIEFjdGl2ZSBTb2NrZXQgQ29ubmVjdGlvbiBEZXRlY3RlZCAhXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzdG9yZS5kaXNwYXRjaChcbiAgICAgICAgICB0aGF0LndzTWVzc2FnZUFjdGlvbnMuZGlzY29ubmVjdFdzKF9zb2NrZXRJZClcbiAgICAgICAgKVxuICAgICAgICB0aGF0LnVwZGF0ZVRleHRCb3goXCJXZWIgU29ja2V0IENvbm5lY3Rpb24gQ2xvc2VkIGF0IDpcIiArIERhdGUubm93KCkudG9TdHJpbmcoKSk7XG4gICAgICB9XG5cbiAgICAgIHNlbmRNZXNzYWdlKCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBtZXNzYWdlIG92ZXIgc29ja2V0XCIpO1xuXG4gICAgICAgIGlmKF9zb2NrZXRJZCA9PT0gbnVsbCApIHtcbiAgICAgICAgICB0aGF0LnVwZGF0ZVRleHRCb3goXCJXQVJOSU5HIDogTm8gQWN0aXZlIFNvY2tldCBDb25uZWN0aW9uIERldGVjdGVkICFcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoYXRNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXQtbXNnJykudmFsdWU7XG4gICAgICAgIGxldCBzb2NrZXRQYXlsb2FkID0gXCJNZXNzYWdlIDpcIiArIGNoYXRNZXNzYWdlICsgIFwiIHwgU2VudCBhdCA6XCIgKyBEYXRlLm5vdygpLnRvU3RyaW5nKCk7XG4gICAgICAgIFxuICAgICAgICBzdG9yZS5kaXNwYXRjaChcbiAgICAgICAgICB0aGF0LndzTWVzc2FnZUFjdGlvbnMuc2VuZFdzTXNnKCBfc29ja2V0SWQgLCBzb2NrZXRQYXlsb2FkKVxuICAgICAgICApXG4gICAgICAgIHRoYXQudXBkYXRlVGV4dEJveChcIkNsaWVudCBTYXlzOiBcIiArIHNvY2tldFBheWxvYWQpO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGVUZXh0Qm94KG1zZykge1xuICAgICAgICBpZiAoIG1lc3NhZ2UudGV4dENvbnRlbnQuc3BsaXQoL1xccipcXG4vKS5sZW5ndGggPj0gTUFYX01TR19ISVNUT1JZICkge1xuICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgfVxuICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gbXNnICsgXCJcXG5cIiArIG1lc3NhZ2UudGV4dENvbnRlbnQ7XG4gICAgICB9XG5cbiAgICB9XG4gICAgUG9seW1lcihXZWJzb2NrZXRzUmVkdXgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
