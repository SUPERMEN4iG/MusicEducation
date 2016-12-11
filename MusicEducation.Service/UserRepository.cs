using MusicEducation.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicEducation.Service
{
	public class UserRepository : BaseRepository
	{
		public string GetGeneralUrl()
		{
			throw new NotImplementedException();
		}

        public int InsertUser_Action(int? idUser, int? idUserAction, string name, string content, int? type)
        {
            return _DBContext.InsertUser_Action(idUser, idUserAction, name, content, type);
        }

        public List<GetGraph_VisitsResult> GetGraph_Visits(int? idUser)
        {
            return _DBContext.GetGraph_Visits(idUser).ToList();
        }

        public List<GetGraph_TestAvgValidAnswersResult> GetGraph_TestAvgValidAnswers(int? idUser, int? idTest)
        {
            return _DBContext.GetGraph_TestAvgValidAnswers(idUser, idTest).ToList();
        }

        public RegisterUserResult RegisterUser(string login, string password)
        {
            return _DBContext.RegisterUser(login, password).FirstOrDefault();
        }

		public InsertUserResult InsertUser(int? idUser, string login, string password, string lastName, string firstName, string middleName, string roleName, string groupName, string teacherLogin, string email, string phone)
		{
			return _DBContext.InsertUser(idUser, DateTime.Now, lastName, firstName, middleName, login, password, roleName, groupName, teacherLogin, email, phone).FirstOrDefault();
		}

		public InsertUserWithoutGroupResult InsertUserWithoutGroup(int? idUser, string login, string password, string lastName, string firstName, string middleName, string roleName, string email, string phone)
		{
			return _DBContext.InsertUserWithoutGroup(idUser, DateTime.Now, lastName, firstName, middleName, login, password, roleName, email, phone).FirstOrDefault();
		}

		public UpdateUserResult UpdateUser(int? idUser, int? idUserCore, string lastName, string firstName, string middleName, string login, string password, string roleName, string groupName, string teacherLogin, string email, string phone, string photoPath)
		{
			return _DBContext.UpdateUser(idUser, DateTime.Now, idUserCore, lastName, firstName, middleName, login, password, roleName, groupName, teacherLogin, email, phone, photoPath).FirstOrDefault();
		}

		public int DeleteUser(int? idUser, int? idUserMain)
		{
			return _DBContext.DeleteUser(idUser, idUserMain);
		}

		public GetUserResult GetUser(int? idUser, string login)
		{
			return _DBContext.GetUser(idUser, login).FirstOrDefault();
		}

        public int ApprovedUser(int? idUser, int? idUserTo)
        {
            return _DBContext.ApprovedUser(idUser, idUserTo);
        }

		public GetUserByIdResult GetUser(int? idUser, int id)
		{
			return _DBContext.GetUserById(idUser, id).FirstOrDefault();
		}

		public List<GetUsersResult> GetUsers(int? idUser)
		{
			var obj = _DBContext.GetUsers(idUser).ToList();
			return obj;
		}

		public List<GetRolesResult> GetRoles(int? idUser)
		{
			var obj = _DBContext.GetRoles(idUser).ToList();
			return obj;
		}

		public IList<GetUserRolesResult> GetUserRoles(int? idUser, string login)
		{
			return _DBContext.GetUserRoles(idUser, login).ToList();
		}

		public List<GetUser_NotificationsResult> GetUser_Notifications(int? idUser)
		{
			return _DBContext.GetUser_Notifications(idUser).ToList();
		}

		public List<GetUser_MessagesResult> GetUser_MessagesAll(int? idUser)
		{
			return _DBContext.GetUser_Messages(idUser, 0).ToList();
		}

		public List<GetUser_MessagesResult> GetUser_MessagesTop10(int? idUser)
		{
			return _DBContext.GetUser_Messages(idUser, 1).ToList();
		}

		public List<GetUser_Messages_ByIdResult> GetUser_Messages_ByIdAll(int? idUser, int? idUserFrom)
		{
			return _DBContext.GetUser_Messages_ById(idUser, idUserFrom, 0).ToList();
		}

		public List<GetUser_Messages_ByIdResult> GetUser_Messages_ByIdAllTop10(int? idUser, int? idUserFrom)
		{
			return _DBContext.GetUser_Messages_ById(idUser, idUserFrom, 1).ToList();
		}

		public int InsertUser_Message(int? idUser, int? idUserFrom, int? idUserTo, string message_name, string message_content, int? message_type)
		{
			return _DBContext.InsertUser_Message(idUser, idUserFrom, idUserTo, message_name, message_content, message_type).FirstOrDefault().Column1.Value;
		}

		public GetUserMessageByIdResult GetUserMessageById(int? idUser, int? idMessage)
		{
			return _DBContext.GetUserMessageById(idUser, idMessage).FirstOrDefault();
		}

		public int InsertUser_Notification(int? idUser, int? toIdUser, string notification_name, string notification_content, int? notification_priorityLevel)
		{
			return _DBContext.InsertUser_Notification(idUser, toIdUser, notification_name, notification_content, notification_priorityLevel);
		}

		public List<GetGroupsResult> GetGroups(int? idUser)
		{
			return _DBContext.GetGroups(idUser).ToList();
		}

        public GetGroupResult GetGroup(int? idUser, int? idGroup)
        {
            return _DBContext.GetGroup(idUser, idGroup).FirstOrDefault();
        }

		public GetGroupMasterResult GetGroupMaster(int? idUser, int? idGroup)
		{
			return _DBContext.GetGroupMaster(idUser, idGroup).FirstOrDefault();
		}

        public int ResetPassword(int? idUser, int? idUserToSet, string password)
        {
            return _DBContext.ResetPassword(idUser, idUserToSet, password);
        }

		public int InsertGroup(int? idUser, string group_name, string group_content)
		{
			return _DBContext.InsertGroup(idUser, group_name, group_content).FirstOrDefault().Column1.Value;
		}

        public int UpdateGroup(int? idUser, int? idGroup, string group_name, string group_content)
        {
            return _DBContext.UpdateGroup(idUser, idGroup, group_name, group_content).FirstOrDefault().Column1.Value;
        }

		public int InsertUser_GroupMaster(int? idUser, int? idUserAppend, int? idGroup)
		{
			return _DBContext.InsertUser_GroupMaster(idUser, idUserAppend, idGroup);
		}

		public int DeleteGroup(int? idUser, int? idGroup)
		{
			return _DBContext.DeleteGroup(idUser, idGroup);
		}

		public bool CheckLogin(int? idUser, string login)
		{
			return _DBContext.CheckLogin(idUser, login).FirstOrDefault().Column1.Value;
		}

		public List<GetUserByFioResult> GetUserByFio(int? idUser, string fio)
		{
			return _DBContext.GetUserByFio(idUser, fio).ToList();
		}
	}
}
