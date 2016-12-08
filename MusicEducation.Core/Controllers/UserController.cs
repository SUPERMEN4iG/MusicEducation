using MusicEducation.Core.API;
using MusicEducation.Core.Lib.Helpers;
using MusicEducation.Service;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace MusicEducation.Core.Controllers
{
    public class InsertUserViewModel
    {
        public int? Id_User { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Group_Name { get; set; }
        public string Teacher_Login { get; set; }
		public string Email { get; set; }
		public string Phone { get; set; }
		public string Photo { get; set; }
	}

	public class InsertGroupViewModel
	{
        public int? Id { get; set; }
		public string Name { get; set; }
		public string Content { get; set; }
		public int[] Teachers { get; set; }
	}

	public class UpdateGroupViewModel : InsertGroupViewModel
	{
		public int Id { get; set; }
	}

	public class DeleteGroupViewModel
	{
		public int Id { get; set; }
	}

	public class LoginViewModel
	{
		public string Login { get; set; }
	}

	public class InsertUserMessageViewModel
	{
		public int? Id_UserTo { get; set; }
		public string Message_Name { get; set; }
		public string Message_Content { get; set; }
		public int? Message_Type { get; set; }
	}

	public class UserController : BaseApiController
	{
		UserRepository _userRepository;

		private readonly GetUserResult _User;

		public UserController()
		{
			_userRepository = new UserRepository();
			_User = _userRepository.GetUser(null, User.Identity.Name);
		}

		public object GetUsers()
		{
			return _userRepository.GetUsers(_User.Id_User);
		}

		public object GetRoles()
		{
			return _userRepository.GetRoles(_User.Id_User);
		}

		[HttpDelete]
        public object DeleteUser(int? id)
        {
            return _userRepository.DeleteUser(_User.Id_User, id);
        }

		public object CheckLogin(InsertUserViewModel model)
		{
			if (!_userRepository.CheckLogin(_User.Id_User, model.Login))
				return new { Status = 0, Message = "Логин существует!" };

			if (Regex.IsMatch(model.Login, @"\p{IsCyrillic}"))
				return new { Status = 0, Message = "Логин должен содержать только буквы латинского алфавита!" };

			return new { Status = 1, Message = "Успех" };
		}

		public object GetUserByFio(string fio)
		{
			return _userRepository.GetUserByFio(_User.Id_User, fio);
		}

		public object InsertUser(InsertUserViewModel model)
        {
            dynamic result = new object();

			var group = _userRepository.GetGroups(_User.Id_User).FirstOrDefault(x => x.Name == model.Group_Name);
			GetGroupMasterResult userMasterGroup = null;

            if (group != null)
            {
                userMasterGroup = _userRepository.GetGroupMaster(_User.Id_User, group.Id);
            }

			if (model.Id_User == null)
            {
				if (userMasterGroup != null)
				{
					result = _userRepository.InsertUser(
						_User.Id_User,
						model.Login,
						System.Web.Helpers.Crypto.HashPassword(model.Password),
						model.LastName,
						model.FirstName,
						model.MiddleName,
						model.Name,
						model.Group_Name,
						userMasterGroup.Login,
						model.Email,
						model.Phone
					);
				}
				else
				{
					result = _userRepository.InsertUserWithoutGroup(
						_User.Id_User,
						model.Login,
						System.Web.Helpers.Crypto.HashPassword(model.Password),
						model.LastName,
						model.FirstName,
						model.MiddleName,
						model.Name,
						model.Email,
						model.Phone
					);
				}
            }
            else 
            {
                var user = _userRepository.GetUser(_User.Id_User, model.Id_User.Value);
				string filePath = null;
				if (model.Photo != null)
				{
					if (model.Photo != user.Photo)
					{
						var base64Data = Regex.Match(model.Photo, @"data:image/(?<type>.+?),(?<data>.+)");
						var file64Data = base64Data.Groups["data"].Value;
						var format64Data = base64Data.Groups["type"].Value.Split(';')[0].ToString();

						byte[] bytes = Convert.FromBase64String(file64Data);

						Image image;
						using (MemoryStream ms = new MemoryStream(bytes))
						{
							image = Image.FromStream(ms);
						}

						filePath = ImageFormated.SaveImage(image, format64Data, HttpContext.Current.Server);
					}
				}

                result = _userRepository.UpdateUser(
                        _User.Id_User,
                        model.Id_User,
                        model.LastName,
                        model.FirstName,
                        model.MiddleName,
                        model.Login,
                        (String.IsNullOrEmpty(model.Password) ? user.Password : System.Web.Helpers.Crypto.HashPassword(model.Password)),
                        model.Name,
                        model.Group_Name,
                        (userMasterGroup == null) ? null : userMasterGroup.Login,
						model.Email,
						model.Phone,
						filePath
                    );
            }

            return result;
        }

        public object GetNotifications()
        {
            return _userRepository.GetUser_Notifications(_User.Id_User);
        }

		public object GetMessages()
		{
			return _userRepository.GetUser_MessagesAll(_User.Id_User);
		}

		public object GetMessagesTop10()
		{
			return _userRepository.GetUser_MessagesTop10(_User.Id_User);
		}

		public object GetMessagesById(int? idUserFrom)
		{
			return _userRepository.GetUser_Messages_ByIdAll(_User.Id_User, idUserFrom);
		}

		public object GetMessagesByIdTop10(int? idUserFrom)
		{
			return _userRepository.GetUser_Messages_ByIdAllTop10(_User.Id_User, idUserFrom);
		}

		public object InsertUserMessage(InsertUserMessageViewModel model)
		{
			return _userRepository.InsertUser_Message(_User.Id_User, _User.Id_User, model.Id_UserTo, model.Message_Name, model.Message_Content, model.Message_Type);
		}

		public object GetMessageById(int? idMessage)
		{
			return _userRepository.GetUserMessageById(_User.Id_User, idMessage);
		}

		public object GetGroups()
        {
            return _userRepository.GetGroups(_User.Id_User);
        }

        public object GetTeachers()
        {
            return _userRepository.GetUsers(_User.Id_User).Where(x => x.Id_Role == 2).ToList();
        }

        public object GetGroup(int? idGroup)
        {
            return _userRepository.GetGroup(_User.Id_User, idGroup);
        }

		public object InsertGroup(InsertGroupViewModel model)
		{
            int? insetedGroupId = null;

            if (model.Id == null)
            {
                insetedGroupId = _userRepository.InsertGroup(_User.Id_User, model.Name, model.Content);
            }
            else
            {
                insetedGroupId = _userRepository.UpdateGroup(_User.Id_User, model.Id, model.Name, model.Content);
            }

			foreach (var teacherId in model.Teachers)
			{
				_userRepository.InsertUser_GroupMaster(_User.Id_User, teacherId, insetedGroupId);
			}

			return true;
		}

		public object UpdateGroup(UpdateGroupViewModel model)
		{
			return null;
		}

		[HttpDelete]
		public object DeleteGroup(int? id)
		{
			return _userRepository.DeleteGroup(_User.Id_User, id);
		}
	}
}