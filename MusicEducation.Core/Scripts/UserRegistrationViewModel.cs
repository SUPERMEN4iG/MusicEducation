using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MusicEducation.Core.Models.ViewModel
{
	public class UserRegisterViewModel
	{
		public string Username { get; set; }

		public string Password { get; set; }

		public string ConfirmPassword { get; set; }
	}
}