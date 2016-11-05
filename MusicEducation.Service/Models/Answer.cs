using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicEducation.Service.Models
{
	public class TestViewModel
	{
		public class AnswerModel
		{
			public int? Id { get; set; }
			public string Name { get; set; }
			public string Content { get; set; }
			public object ContentUserAnswer { get; set; }
			public bool isUserAnswer { get; set; }
			public bool? IsValid { get; set; }
		}
		public class QuestionModel
		{
			public int? Id { get; set; }
			public string Name { get; set; }
			public string Content { get; set; }
			public IList<AnswerModel> Answers { get; set; }
			public int? QuestionType { get; set; }
		}

		public int? Id { get; set; }
		public string Name { get; set; }
		public bool? IsCompleted { get; set; }
		public int? CountAttempts { get; set; }
		public bool? IsShowHints { get; set; }
		public int? Id_User_TestType { get; set; }
		public IList<QuestionModel> Questions { get; set; }
	}
}
