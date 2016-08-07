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
      var urlValue = protocol + document.getElementById("websocket-url").getAttribute("value") + "/";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL3dzLXBvbHkvd2Vic29ja2V0cy1yZWR1eC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFJLGNBQUo7QUFDSSxJQUFJLFlBQWMsSUFBbEI7QUFDQSxJQUFJLGFBQWMsSUFBbEI7QUFDQSxJQUFJLGFBQWMsSUFBbEI7QUFDQSxJQUFNLGtCQUFrQixFQUF4Qjs7QUFHQTs7SUFDTSxlOzs7Ozs7O3FDQUVhO0FBQ2YsV0FBSyxFQUFMLEdBQVUsU0FBVjs7QUFFQSxXQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFFRDs7OzhCQUVTO0FBQ1I7QUFDQSxXQUFLLGdCQUFMLEdBQXdCO0FBQ3RCLG1CQUFXLG1CQUFDLEVBQUQsRUFBSyxTQUFMLEVBQW1CO0FBQzVCLGlCQUFPO0FBQ0wsa0JBQU0saUJBREQ7QUFFTCxrQkFBTSxFQUZEO0FBR0wsbUJBQU87QUFIRixXQUFQO0FBS0QsU0FQcUI7QUFRdEIsbUJBQVcsbUJBQUMsRUFBRCxFQUFLLEdBQUwsRUFBYTtBQUN0QixpQkFBTztBQUNMLGtCQUFNLFlBREQ7QUFFTCxrQkFBTSxFQUZEO0FBR0wsbUJBQU87QUFIRixXQUFQO0FBS0QsU0FkcUI7QUFldEIsc0JBQWMsc0JBQUMsRUFBRCxFQUFRO0FBQ3BCLGlCQUFPO0FBQ0wsa0JBQU0sZUFERDtBQUVMLGtCQUFNO0FBRkQsV0FBUDtBQUlEO0FBcEJxQixPQUF4QjtBQXNCRDs7OzRCQUVPO0FBQ04sVUFBSSxPQUFPLElBQVg7QUFDQTtBQUNBLGVBQVMsVUFBVCxHQUlhO0FBQUEsWUFKTyxLQUlQLHlEQUplLFVBQVUsR0FBVixDQUFjO0FBQ3hDLGdCQUFTLElBRCtCO0FBRXhDLGlCQUFTLEVBRitCO0FBR3hDLGlCQUFTO0FBSCtCLFNBQWQsQ0FJZjtBQUFBLFlBQVAsTUFBTzs7O0FBRVgsZ0JBQVEsT0FBTyxJQUFmO0FBQ0UsZUFBSyxpQkFBTDtBQUNFLG1CQUFPLElBQVAsQ0FBWSxJQUFaLENBQWlCLE9BQU8sS0FBeEI7QUFDQSxt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RyxjQUFjLElBQWpCLEVBQXdCO0FBQ3RCLGFBQUssYUFBTCxDQUFtQixrREFBbkI7QUFDQTtBQUNEOztBQUVELFVBQUksY0FBYyxTQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsS0FBdEQ7QUFDQSxVQUFJLGdCQUFnQixjQUFjLFdBQWQsR0FBNkIsY0FBN0IsR0FBOEMsS0FBSyxHQUFMLEdBQVcsUUFBWCxFQUFsRTs7QUFFQSxZQUFNLFFBQU4sQ0FDRSxLQUFLLGdCQUFMLENBQXNCLFNBQXRCLENBQWlDLFNBQWpDLEVBQTZDLGFBQTdDLENBREY7QUFHQSxXQUFLLGFBQUwsQ0FBbUIsa0JBQWtCLGFBQXJDO0FBQ0Q7OztrQ0FFYSxHLEVBQUs7QUFDakIsVUFBSyxRQUFRLFdBQVIsQ0FBb0IsS0FBcEIsQ0FBMEIsT0FBMUIsRUFBbUMsTUFBbkMsSUFBNkMsZUFBbEQsRUFBb0U7QUFDbEUsZ0JBQVEsV0FBUixHQUFzQixFQUF0QjtBQUNEO0FBQ0QsY0FBUSxXQUFSLEdBQXNCLE1BQU0sSUFBTixHQUFhLFFBQVEsV0FBM0M7QUFDRDs7Ozs7O0FBR0gsUUFBUSxlQUFSIiwiZmlsZSI6ImVsZW1lbnRzL3dzLXBvbHkvd2Vic29ja2V0cy1yZWR1eC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBzdG9yZTtcbiAgICBsZXQgX3NvY2tldElkICAgPSBudWxsO1xuICAgIGxldCBfc29ja2V0TXNnICA9IG51bGw7XG4gICAgbGV0IF9zb2NrZXRVUkwgID0gbnVsbDtcbiAgICBjb25zdCBNQVhfTVNHX0hJU1RPUlkgPSAyMDtcblxuXG4gICAgLyogVE9ETzogY3JlYXRlIHRoZSBQb2x5bWVyIGVsZW1lbnQncyBkZWZpbml0aW9uIGluIEVTMjAxNSAqL1xuICAgIGNsYXNzIFdlYnNvY2tldHNSZWR1eCB7XG5cbiAgICAgIGJlZm9yZVJlZ2lzdGVyKCkge1xuICAgICAgICB0aGlzLmlzID0gJ3dzLXBvbHknO1xuXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IHtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgY3JlYXRlZCgpIHtcbiAgICAgICAgLy8gRGVmaW5lIEFsbCBBY3Rpb25zIFxuICAgICAgICB0aGlzLndzTWVzc2FnZUFjdGlvbnMgPSB7XG4gICAgICAgICAgc2VuZFdzTXNnOiAod3MsIHdzTWVzc2FnZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdHlwZTogJ1NFTkRfV1NfTUVTU0FHRScsXG4gICAgICAgICAgICAgIHdzSWQ6IHdzLFxuICAgICAgICAgICAgICB3c01zZzogd3NNZXNzYWdlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgY29ubmVjdFdzOiAod3MsIHVybCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdHlwZTogJ0NPTk5FQ1RfV1MnLFxuICAgICAgICAgICAgICB3c0lkOiB3cyxcbiAgICAgICAgICAgICAgd3NVcmw6IHVybFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRpc2Nvbm5lY3RXczogKHdzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB0eXBlOiAnRElTQ09OTkVDVF9XUycsXG4gICAgICAgICAgICAgIHdzSWQ6IHdzXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJlYWR5KCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIC8vIEluaXRpYWxpemUgIFJlZHV4ICBTdG9yZVxuICAgICAgICBmdW5jdGlvbiBtc2dSZWR1Y2VyKHN0YXRlID0gSW1tdXRhYmxlLk1hcCh7XG4gICAgICAgICAgd3NJZCAgIDogbnVsbCxcbiAgICAgICAgICB3c1VybCAgOiAnJyxcbiAgICAgICAgICB3c01zZyAgOiAnJ1xuICAgICAgICAgIH0pLCBhY3Rpb24pe1xuXG4gICAgICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnU0VORF9XU19NRVNTQUdFJzpcbiAgICAgICAgICAgICAgYWN0aW9uLndzSWQuc2VuZChhY3Rpb24ud3NNc2cpO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHdzSWQgICA6IGFjdGlvbi53c0lkLFxuICAgICAgICAgICAgICAgIHdzVXJsICA6ICcnLFxuICAgICAgICAgICAgICAgIHdzTXNnICA6IGFjdGlvbi53c01zZ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdDT05ORUNUX1dTJzpcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHdzSWQgICA6IG5ldyBXZWJTb2NrZXQoYWN0aW9uLndzVXJsKSxcbiAgICAgICAgICAgICAgICB3c1VybCAgOiBhY3Rpb24ud3NVcmwsXG4gICAgICAgICAgICAgICAgd3NNc2cgIDogJydcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnRElTQ09OTkVDVF9XUyc6XG4gICAgICAgICAgICAgIGFjdGlvbi53c0lkLmNsb3NlKCk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd3NJZCAgIDogbnVsbCxcbiAgICAgICAgICAgICAgICB3c1VybCAgOiAnJyxcbiAgICAgICAgICAgICAgICB3c01zZyAgOiAnJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICByZXR1cm4gc3RhdGVcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZWZpbmUgQXBwIGFzIGNvbWJpbmF0aW9uIG9mIGFsbCByZWR1Y2Vyc1xuICAgICAgICBjb25zdCB3c1JlZHV4QXBwID0gUmVkdXguY29tYmluZVJlZHVjZXJzKHtcbiAgICAgICAgICBtc2dSZWR1Y2VyXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBpbml0aWFsU3RhdGUgPSBJbW11dGFibGUuTGlzdC5vZigpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBTdG9yZVxuICAgICAgICBzdG9yZSA9IFJlZHV4LmNyZWF0ZVN0b3JlKG1zZ1JlZHVjZXIsIGluaXRpYWxTdGF0ZSk7XG5cbiAgICAgICAgLy8gU3Vic2NyaWJlIFZhcmlhYmxlc1xuICAgICAgICBzdG9yZS5zdWJzY3JpYmUoZnVuY3Rpb24oKXtcbiAgICAgICAgICBfc29ja2V0SWQgICA9IHN0b3JlLmdldFN0YXRlKCkud3NJZDtcbiAgICAgICAgICBfc29ja2V0TXNnICA9IHN0b3JlLmdldFN0YXRlKCkud3NNc2c7XG4gICAgICAgICAgX3NvY2tldFVSTCAgPSBzdG9yZS5nZXRTdGF0ZSgpLndzVXJsO1xuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBhdHRhY2hlZCgpe1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIC8vIHRoYXQuY29ubmVjdFNvY2tldCgpO1xuICAgICAgfVxuXG4gICAgICBjb25uZWN0U29ja2V0KCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIGxldCBwcm90b2NvbCA9IFwid3M6Ly9cIjtcbiAgICAgICAgY29uc29sZS5sb2coXCJBcnJpdmVkIGF0IGNvbm5lY3RTb2NrZXQuXCIpO1xuXG4gICAgICAgIGlmIChfc29ja2V0SWQgIT0gbnVsbCkge1xuICAgICAgICAgIHRoYXQudXBkYXRlVGV4dEJveChcIldlYnNvY2tldCBhbHJlYWR5IGFjdGl2ZSBicmFoICFcIik7XG4gICAgICAgICAgcmV0dXJuIDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYod2luZG93LmxvY2F0aW9uLnByb3RvY29sID09IFwiaHR0cHM6XCIpIHtcbiAgICAgICAgICBwcm90b2NvbCA9IFwid3NzOi8vXCI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHVybFZhbHVlID0gcHJvdG9jb2wgKyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndlYnNvY2tldC11cmxcIikuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikgKyBcIi9cIjtcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2goXG4gICAgICAgICAgdGhhdC53c01lc3NhZ2VBY3Rpb25zLmNvbm5lY3RXcyhfc29ja2V0SWQsIHVybFZhbHVlKVxuICAgICAgICAgIClcblxuICAgICAgICBfc29ja2V0SWQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICB0aGF0LnVwZGF0ZVRleHRCb3goXCIgU29ja2V0IENvbm5lY3RlZCAhIFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRGlzcGxheSBtZXNzYWdlcyByZWNlaXZlZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgICAgX3NvY2tldElkLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgdGhhdC51cGRhdGVUZXh0Qm94KFwiV1MgU2VydmVyIFNheXM6IFwiICsgZXZlbnQuZGF0YSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIERpc3BsYXkgYW55IGVycm9ycyB0aGF0IG9jY3VyXG4gICAgICAgIF9zb2NrZXRJZC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICB0aGF0LnVwZGF0ZVRleHRCb3goXCIgU29ja2V0IEVSUk9SUlJSUlIgXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBfc29ja2V0SWQuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgc3RvcmUuZGlzcGF0Y2goXG4gICAgICAgICAgICB0aGF0LndzTWVzc2FnZUFjdGlvbnMuZGlzY29ubmVjdFdzKF9zb2NrZXRJZClcbiAgICAgICAgICApXG4gICAgICAgICAgdGhhdC51cGRhdGVUZXh0Qm94KFwiIFNvY2tldCBDTE9TRUQgISEhISEhISEgXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZGlzY29ubmVjdFNvY2tldCgpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNsb3NpbmcgbWVzc2FnZSBvdmVyIHNvY2tldFwiKTtcblxuICAgICAgICBpZihfc29ja2V0SWQgPT09IG51bGwgKSB7XG4gICAgICAgICAgdGhhdC51cGRhdGVUZXh0Qm94KFwiV0FSTklORyA6IE5vIEFjdGl2ZSBTb2NrZXQgQ29ubmVjdGlvbiBEZXRlY3RlZCAhXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzdG9yZS5kaXNwYXRjaChcbiAgICAgICAgICB0aGF0LndzTWVzc2FnZUFjdGlvbnMuZGlzY29ubmVjdFdzKF9zb2NrZXRJZClcbiAgICAgICAgKVxuICAgICAgICB0aGF0LnVwZGF0ZVRleHRCb3goXCJXZWIgU29ja2V0IENvbm5lY3Rpb24gQ2xvc2VkIGF0IDpcIiArIERhdGUubm93KCkudG9TdHJpbmcoKSk7XG4gICAgICB9XG5cbiAgICAgIHNlbmRNZXNzYWdlKCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBtZXNzYWdlIG92ZXIgc29ja2V0XCIpO1xuXG4gICAgICAgIGlmKF9zb2NrZXRJZCA9PT0gbnVsbCApIHtcbiAgICAgICAgICB0aGF0LnVwZGF0ZVRleHRCb3goXCJXQVJOSU5HIDogTm8gQWN0aXZlIFNvY2tldCBDb25uZWN0aW9uIERldGVjdGVkICFcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoYXRNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXQtbXNnJykudmFsdWVcbiAgICAgICAgbGV0IHNvY2tldFBheWxvYWQgPSBcIk1lc3NhZ2UgOlwiICsgY2hhdE1lc3NhZ2UgKyAgXCIgfCBTZW50IGF0IDpcIiArIERhdGUubm93KCkudG9TdHJpbmcoKTtcbiAgICAgICAgXG4gICAgICAgIHN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgIHRoYXQud3NNZXNzYWdlQWN0aW9ucy5zZW5kV3NNc2coIF9zb2NrZXRJZCAsIHNvY2tldFBheWxvYWQpXG4gICAgICAgIClcbiAgICAgICAgdGhhdC51cGRhdGVUZXh0Qm94KFwiQ2xpZW50IFNheXM6IFwiICsgc29ja2V0UGF5bG9hZCk7XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZVRleHRCb3gobXNnKSB7XG4gICAgICAgIGlmICggbWVzc2FnZS50ZXh0Q29udGVudC5zcGxpdCgvXFxyKlxcbi8pLmxlbmd0aCA+PSBNQVhfTVNHX0hJU1RPUlkgKSB7XG4gICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSBtc2cgKyBcIlxcblwiICsgbWVzc2FnZS50ZXh0Q29udGVudDtcbiAgICAgIH1cblxuICAgIH1cbiAgICBQb2x5bWVyKFdlYnNvY2tldHNSZWR1eCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
