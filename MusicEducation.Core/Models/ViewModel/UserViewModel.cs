using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MusicEducation.Core.Models.ViewModel
{
	public class UserViewModel
	{
		public int Id { get; set; }
		public string LastName { get; set; }
		public string FirstName { get; set; }
		public string MiddleName { get; set; }
		public string Login { get; set; }
		public int? Id_UserCreate { get; set; }
		public DateTime? DateCreate { get; set; }
		public int Id_Role { get; set; }
		public string RoleName { get; set; }
	}
}