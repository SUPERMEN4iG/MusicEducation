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

		public InsertUserResult InsertUser(string login, string password, string lastName, string firstName, string middleName)
		{
			return _DBContext.InsertUser(null, DateTime.Now, lastName, firstName, middleName, login, password).FirstOrDefault();
		}

		public GetUserResult GetUser(int? idUser, string login)
		{
			return _DBContext.GetUser(idUser, login).FirstOrDefault();
		}

		public IList<GetUserRolesResult> GetUserRoles(int? idUser, string login)
		{
			return _DBContext.GetUserRoles(idUser, login).ToList();
		}
	}
}
