using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity.Validation;
using System.Data.Entity.Infrastructure;

namespace CRUDAjax.Controllers
{
    public class HomeController : Controller
    {
        ContosoUniversity2Entities1 contosoDB = new ContosoUniversity2Entities1();
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult date()
        {
            return View();
        }

        public JsonResult List()
        {
            var results = from person in contosoDB.Person
                         where person.Discriminator == "Student"
                         select person;

            return Json(results, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Add(Person person)
        {
            contosoDB.Person.Add(person);
            var results = contosoDB.SaveChanges();

            return new JsonResult() { Data = results, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetbyID(int ID)
        {
            var person = contosoDB.Person.Find(ID);

            return Json(person, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Update(Person person)
        {
            contosoDB.Person.Add(person);
            contosoDB.Entry(person).State = EntityState.Modified;
            var results = contosoDB.SaveChanges();

            return new JsonResult() { Data = results, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult Delete(int ID)
        {
            Person person = contosoDB.Person.Find(ID);
            try
            {
                contosoDB.Person.Remove(person);
                contosoDB.SaveChanges();
            }
            catch (Exception ex)
            {
                return Json(false);
            }

            return Json(person, JsonRequestBehavior.AllowGet);
        }
    }
}