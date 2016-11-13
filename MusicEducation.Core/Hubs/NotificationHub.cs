using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading;
using MusicEducation.Service;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR.Hubs;
using System.Diagnostics;
using System.Web.Helpers;

namespace MusicEducation.Core.Hubs
{
    public class UserModel
	{
		public int Id { get; set; }
        public string Login { get; set; }
	}

    [HubName("notificationHub")]
    public class NotificationHub : Hub
    {
        public const string GROUP_NOTIFICATIONS = "notifications";

        //private readonly static ConnectionMapping<string> _connections;
        private readonly static ConnectionMapping<string> _groups = new ConnectionMapping<string>();
        private readonly static Dictionary<string, UserModel> _userMapping = new Dictionary<string, UserModel>();

        private UserRepository _userRepository;

        public NotificationHub()
        {
            _userRepository = new UserRepository();
        }

        public void Send(dynamic message)
        {
            string to = message.to.ToString();
            string content = message.data.Content;
            string name = message.data.Name;
            int id_userCreator = message.data.Id_UserCreator;
            int priorityLevel = message.data.PriorityLevel;

            var fromUser = _userRepository.GetUser(id_userCreator, id_userCreator);
            var toUser = _userRepository.GetUser(id_userCreator, to);

            _userRepository.InsertUser_Notification(id_userCreator, toUser.Id_User, name, content, priorityLevel);

            var sendingData = new {
                Content = content,
                DateCreate = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fff"),
                FIO = fromUser.LastName  + ' ' + fromUser.FirstName + ' ' + fromUser.MiddleName,
                Id = -1,
                Id_User = toUser.Id_User,
                Name = name,
                PriorityLevel = priorityLevel
            };

            Clients.Group(to).broadcastMessage(sendingData);
            //Clients.Client(keyPairValue.Key).broadcastMessage(message.Content);
        }

        public void OnConnected(bool isEnable)
        {
            var currentUser = Json.Decode(Context.RequestCookies.FirstOrDefault(x => x.Key == "globals").Value.Value).currentUser;
            string name = currentUser.username.ToString();
            if (!_groups.GetConnections(name).Contains(Context.ConnectionId))
            {
                var user = _userRepository.GetUser(null, name);
                var connectionId = Context.ConnectionId;
                Groups.Add(Context.ConnectionId, name);
                _groups.Add(name, Context.ConnectionId);

                _userMapping.Add(Context.ConnectionId, new UserModel()
                {
                    Id = user.Id_User,
                    Login = user.Login
                });

                //new Thread(new ThreadStart(() => {
                //	Clients.Group(GROUP_CALL_CENTER).broadcastMessage("HELLO Client to group");
                //})).Start();
                // Add connection to group "foo"
                //Clients.Group(GROUP_NOTIFICATIONS).broadcastMessage("PING GROUP_NOTIFICATIONS");

                //Groups.Add(Context.ConnectionId, GROUP_NOTIFICATIONS);

                //// Call send on everyone in group "foo"
                Clients.Group(name).broadcastMessage("PING GROUP_NOTIFICATIONS");

                //// Call send on everyone else but the caller in group "foo"
                //Clients.OthersInGroup(GROUP_NOTIFICATIONS).broadcastMessage("PING GROUP_NOTIFICATIONS");

                //// Call send on everyone in "foo" excluding the specified connection ids
                //Clients.Group(GROUP_NOTIFICATIONS, Context.ConnectionId).broadcastMessage("PING GROUP_NOTIFICATIONS");
            }
        }

        //public override Task OnConnected()
        //{
        //    Debug.WriteLine("[NotificationHub] OnConnected");
        //    string name = Context.User.Identity.Name;

        //    if (!_groups.GetConnections(GROUP_NOTIFICATIONS).Contains(Context.ConnectionId))
        //    {
        //        Groups.Add(Context.ConnectionId, GROUP_NOTIFICATIONS);
        //        _groups.Add(GROUP_NOTIFICATIONS, Context.ConnectionId);

        //        var user = _userRepository.GetUser(null, name);

        //        _userMapping.Add(Context.ConnectionId, new UserModel() 
        //        {
        //            Id = user.Id_User,
        //            Login = user.Login
        //        });

        //        //new Thread(new ThreadStart(() => {
        //        //	Clients.Group(GROUP_CALL_CENTER).broadcastMessage("HELLO Client to group");
        //        //})).Start();
        //        new Thread(new ThreadStart(() =>
        //        {
        //            Clients.Client(Context.ConnectionId).broadcastMessage("PING GROUP_NOTIFICATIONS");
        //        })).Start();
        //    }

        //    return base.OnConnected();
        //}

        //public override Task OnDisconnected(bool stopCalled)
        //{
        //    string name = Context.User.Identity.Name;

        //    Groups.Remove(Context.ConnectionId, GROUP_NOTIFICATIONS);
        //    _groups.Remove(GROUP_NOTIFICATIONS, Context.ConnectionId);

        //    _userMapping.Remove(Context.ConnectionId);

        //    new Thread(new ThreadStart(() =>
        //    {
        //        Clients.Group(GROUP_NOTIFICATIONS).broadcastMessage("BYE-BYE Client to group");
        //    })).Start();

        //    return base.OnDisconnected(stopCalled);
        //}
    }
}