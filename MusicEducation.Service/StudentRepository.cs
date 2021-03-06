﻿using MusicEducation.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicEducation.Service
{
    public class StudentRepository : BaseRepository
    {
        public List<GetStudentsResult> GetStudents(int? idUser)
        {
            var result = _DBContext.GetStudents(idUser).ToList();

            return result;
        }

        public InsertUser_TestResult AppnedTestToUser(int? idMainUser, int? idUser, int? idTest, int? countAttempts, int? countAttemptsAll, int? timing, int? complexity, int? idUserTestType, int? isShowHints)
		{
            if (!countAttempts.HasValue)
                countAttempts = 1;

			if (!idUserTestType.HasValue)
				idUserTestType = 1;

			if (!isShowHints.HasValue)
				isShowHints = 1;

            var result = _DBContext.InsertUser_Test(idMainUser, idUser, idTest, idUserTestType, countAttempts, countAttemptsAll, (isShowHints == 1 ? true : false), timing, complexity).FirstOrDefault();

			return result;
		}

        public InsertUser_TestResult AppnedTestToUserWithContent(int? idMainUser, int? idUser, int? idTest, int? idUserTestType, int? countAttempts, int? countAttemptsAll, bool? isShowHints)
		{
            var result = _DBContext.InsertUser_Test(idMainUser, idUser, idTest, idUserTestType, countAttempts, countAttemptsAll, isShowHints, null, null).FirstOrDefault();

			return result;
		}
	}
}
