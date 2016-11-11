using MusicEducation.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicEducation.Service
{
    public class UserRepository : BaseRepository, IUserRepository
	{
		public string GetGeneralUrl()
		{
			throw new NotImplementedException();
		}

		public InsertUserResult InsertUser(string login, string password, string lastName, string firstName, string middleName, string roleName)
		{
			return _DBContext.InsertUser(null, DateTime.Now, lastName, firstName, middleName, login, password, roleName).FirstOrDefault();
		}

        public UpdateUserResult UpdateUser(int? idUser, int? idUserCore, string lastName, string firstName, string middleName, string login, string password, string roleName)
        {
            return _DBContext.UpdateUser(idUser, DateTime.Now, idUserCore, lastName, firstName, middleName, login, password, roleName).FirstOrDefault();
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
	}
}
