using MusicEducation.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MusicEducation.Service;
using MusicEducation.Web.API;
using MusicEducation.Web.Lib.Filters;
using MusicEducation.Web.Lib.Constants;

namespace MusicEducation.Web.Controllers.Api
{
	[BasicAuthorize(UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT)]
    public class TestServiceController : BaseApiController
	{
        private readonly IUserRepository _testService;

        public TestServiceController(IUserRepository testService)
        {
            _testService = testService;
        }

		[HttpPost]
		public InsertUserResult Register([FromBody] dynamic data)
		{
			string login = data["login"] != null && data["login"].Value != null ? Convert.ToString(data["login"].Value) : null;
			string password = data["password"] != null && data["password"].Value != null ? Convert.ToString(data["password"].Value) : null;
			string confirmPassword = data["confirmPassword"] != null && data["confirmPassword"].Value != null ? Convert.ToString(data["confirmPassword"].Value) : null;
			//string firstName = data["firstName"] != null && data["firstName"].Value != null ? Convert.ToString(data["firstName"].Value) : null;
			//string lastName = data["lastName"] != null && data["lastName"].Value != null ? Convert.ToString(data["lastName"].Value) : null;
			//string middleName = data["middleName"] != null && data["middleName"].Value != null ? Convert.ToString(data["middleName"].Value) : null;

			return _testService.InsertUser(login, System.Web.Helpers.Crypto.HashPassword(password), null, null, null);
		}

        public string Get()
        {
			return string.Empty;
        }
    }
}
