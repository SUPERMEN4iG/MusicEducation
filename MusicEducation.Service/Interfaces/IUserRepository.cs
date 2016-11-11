using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicEducation.Service.Interfaces
{
    public interface IUserRepository
    {
        InsertUserResult InsertUser(string login, string password, string lastName, string firstName, string middleName, string roleName);
        UpdateUserResult UpdateUser(int? idUser, int? idUserCore, string lastName, string firstName, string middleName, string login, string password, string roleName);
		GetUserResult GetUser(int? idUser, string login);
        GetUserByIdResult GetUser(int? idUser, int id);
		IList<GetUserRolesResult> GetUserRoles(int? idUser, string login);


		string GetGeneralUrl();
    }
}
