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

		public InsertUserResult InsertUser(int? idUser, string login, string password, string lastName, string firstName, string middleName, string roleName, string groupName, string teacherLogin, string email, string phone)
		{
            return _DBContext.InsertUser(idUser, DateTime.Now, lastName, firstName, middleName, login, password, roleName, groupName, teacherLogin, email, phone).FirstOrDefault();
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

        public int InsertUser_Notification(int? idUser, int? toIdUser, string notification_name, string notification_content, int? notification_priorityLevel)
        {
            return _DBContext.InsertUser_Notification(idUser, toIdUser, notification_name, notification_content, notification_priorityLevel);
        }

        public List<GetGroupsResult> GetGroups(int? idUser)
        {
            return _DBContext.GetGroups(idUser).ToList();
        }
	}
}
