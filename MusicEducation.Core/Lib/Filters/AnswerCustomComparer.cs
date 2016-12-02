using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MusicEducation.Core.Lib.Filters
{
    using MusicEducation.Service.Models;

    public class AnswerCustomComparer : IEqualityComparer<TestViewModel.AnswerModel>
    {
        public bool Equals(TestViewModel.AnswerModel x, TestViewModel.AnswerModel y)
        {
            if (Object.ReferenceEquals(x, y)) return true;

            //Check whether any of the compared objects is null.
            if (Object.ReferenceEquals(x, null) || Object.ReferenceEquals(y, null))
                return false;

            return x.Id == y.Id && x.Name == y.Name;
        }


        public int GetHashCode(TestViewModel.AnswerModel obj)
        {
            //Check whether the object is null
            if (Object.ReferenceEquals(obj, null)) return 0;

            //Get hash code for the Name field if it is not null.
            int hashProductName = obj.Name == null ? 0 : obj.Name.GetHashCode();

            //Get hash code for the Code field.
            int hashProductCode = obj.Id.GetHashCode();

            //Calculate the hash code for the product.
            return hashProductName ^ hashProductCode;
        }
    }
}