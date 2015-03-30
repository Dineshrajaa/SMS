$(document).ready(function(){
	/**Global Declarations**/
	var dbName,loggedUser,userid;

	function toastAlert(msg){
		//This is used for showing the alerts in Toast style in Center
	window.plugins.toast.showLongCenter(msg);
	}


	function loginCheck(){
		if ($("#logintext").val()=="admin") $(":mobile-pagecontainer").pagecontainer("change","#admin-page");
		else{
			userid=$("#logintext").val();
			dbName.transaction(function(tx){
				tx.executeSql("select * from studentprofiletable where sreg='"+userid+"'",[],function(tx,results){
					loggedUser=results.rows.item(0).sname;
					$(":mobile-pagecontainer").pagecontainer("change","#userhome-page");
					$("#usernamelabel").text("Welcome "+loggedUser);
				});
			});
		}
	}
	
	function setupDB(){
		dbName.transaction(function(tx){
			tx.executeSql("create table if not exists studentprofiletable(sid integer primary key,sreg integer unique,sname text,sfname text,sdob text,sgender text,sblood text,smob text,smail text,saddress text)");
			tx.executeSql("create table if not exists studentattendancetable(aeid integer primary key,sreg integer,sworkingdays integer,spresent integer,sabsent integer)");
			tx.executeSql("create table if not exists subjectstable(seid integer primary key,semid text unique,a text,b text,c text,d text,e text,f text)");
			tx.executeSql("create table if not exists ciamarkstable(cid integer primary key,sreg integer,semid text,cianumber text,ca text,cb text,cc text,cd text,ce text,cf text)");
			tx.executeSql("create table if not exists semmarkstable(eid integer primary key,sreg integer,semid text,a text,b text,c text,d text,e text,f text)");
		});
	}

	function addSubjects(){
		var semname=$("#semesterlabel :selected").text();
		var suba=$("#sub1").val();
		var subb=$("#sub2").val();
		var subc=$("#sub3").val();
		var subd=$("#sub4").val();
		var sube=$("#sub5").val();
		var subf=$("#sub6").val();
		dbName.transaction(function(tx){
			tx.executeSql("insert into subjectstable(semid,a,b,c,d,e,f) values(?,?,?,?,?,?,?)",[semname,suba,subb,subc,subd,sube,subf]);
		});
		toastAlert("Added Subject Details Successfully");
	}

	function addStudent(){
		var regno=$("#uregno").val();
		var name=$("#uname").val();
		var fname=$("#ufname").val();
		var dob=$("#udob").val();
		var gender=$("#ugender :selected").text();
		var blood=$("#ublood").val();
		var mobile=$("#umobile").val();
		var mail=$("#umail").val();
		var address=$("#uaddress").val();
		dbName.transaction(function(tx){
			tx.executeSql("insert into studentprofiletable(sreg,sname,sfname,sdob,sgender,sblood,smob,smail,saddress) values(?,?,?,?,?,?,?,?,?)",[regno,name,fname,dob,gender,blood,mobile,mail,address]);
		});
		toastAlert("Added Student Profile Successfully");		
	}

	$("#studid,#studreg").on("input",function(){
			//Method to find what is being typed
			fetchStudentDetails($(this).val());			
		});



	function fetchStudentDetails(eid){
		dbName.transaction(function(tx){
			tx.executeSql("select * from studentprofiletable where sreg='"+eid+"'",[],function(tx,results){
				if (results.rows.length>0) {
					$("#studentnamelabel,#studentname").text("Name:"+results.rows.item(0).sname);
				}
				else {
					$("#studentnamelabel,#studentname").text("");
					toastAlert("Invalid Register number");
				}
			});
		})
	}

	function addAttendance(){
		var aid=$("#studid").val();
		var twd=$("#twd").val();
		var tlc=$("#tlc").val();
		var tpc=twd-tlc;
		dbName.transaction(function(tx){
			tx.executeSql("insert into studentattendancetable(sreg,sworkingdays,spresent,sabsent) values(?,?,?,?)",[aid,twd,tpc,tlc]);
		});
		toastAlert("Added Attendance Details Successfully");
	}

	$("#semesterlist").on("change",function(){
		//alert($("#semesterlist :selected").text());
		fetchSemesterDetails($("#semesterlist :selected").text());
	});

	function fetchSemesterDetails(sem){
		dbName.transaction(function(tx){
			tx.executeSql("select * from subjectstable where semid='"+sem+"'",[],function(tx,results){
				if (results.rows.length>0) {
				$("#sublabel1").text(results.rows.item(0).a);
				$("#sublabel2").text(results.rows.item(0).b);
				$("#sublabel3").text(results.rows.item(0).c);
				$("#sublabel4").text(results.rows.item(0).d);
				$("#sublabel5").text(results.rows.item(0).e);
				$("#sublabel6").text(results.rows.item(0).f);
				}
				else $("#sublabel1,#sublabel2,#sublabel3,#sublabel4,#sublabel5,#sublabel6").text("");
			});
		});
	}

	function addCIAMarks(){
		var ucid=$("#studreg").val();
		var ucsem=$("#semesterlist :selected").text();
		var ucia=$("#cialist :selected").text();
		var uca=$("#subject1").val();
		var ucb=$("#subject2").val();
		var ucc=$("#subject3").val();
		var ucd=$("#subject4").val();
		var uce=$("#subject5").val();
		var ucf=$("#subject6").val();
		dbName.transaction(function(tx){
			tx.executeSql("insert into ciamarkstable(sreg,semid,cianumber,ca,cb,cc,cd,ce,cf) values(?,?,?,?,?,?,?,?,?)",[ucid,ucsem,ucia,uca,ucb,ucc,ucd,uce,ucf]);
		});
		toastAlert("Added CIA Mark Details Successfully");
	}

	function fetchAttendanceDetails(){
		dbName.transaction(function(tx){
			tx.executeSql("select * from studentattendancetable where sreg='"+userid+"'",[],function(tx,results){
				$("#userattendancepara").html("No. of Actual Working Days:"+results.rows.item(0).sworkingdays+"<br/><br/>No. of Leave:"+results.rows.item(0).sabsent+"<br/><br/>No. of days present:"+results.rows.item(0).spresent);
			});
		});
	}

	function showProfileDetails(){
		$("#userprofilepara").text(" ");
		dbName.transaction(function(tx){
				tx.executeSql("select * from studentprofiletable where sreg='"+userid+"'",[],function(tx,results){
					// loggedUser=results.rows.item(0).sname;
					var name=results.rows.item(0).sname;
					var fname=results.rows.item(0).sfname;
					var dob=results.rows.item(0).sdob;
					var gender=results.rows.item(0).sgender;
					var blood=results.rows.item(0).sblood;
					var mobile=results.rows.item(0).smob;
					var mail=results.rows.item(0).smail;
					var address=results.rows.item(0).saddress;
					$("#userprofilepara").html("Name:"+name+"<br/><br/><br/>Father Name:"+fname+"<br/><br/><br/>DOB:"+dob+"<br/><br/><br/>Gender:"+gender+"<br/><br/><br/>Blood Group:"+blood+"<br/><br/><br/>Mobile:"+mobile+"<br/><br/><br/>Mail:"+mail+"<br/><br/><br/>Address:"+address);					
					
				});
			});
		
	}

	$("#cianame").on("change",function(){
		//alert($("#semesterlist :selected").text());
		showCIADetails($("#cianame :selected").text());
	});

	function showCIADetails(cianame){
		var semname=$("#semname :selected").text();		
		dbName.transaction(function(tx){
			tx.executeSql("select * from ciamarkstable C join subjectstable S on C.semid=S.semid where C.sreg='"+userid+"' and C.cianumber='"+cianame+"' and C.semid='"+semname+"'",[],function(tx,results){
				if (results.rows.length>0) {
					var subn1=results.rows.item(0).a;
					var subn2=results.rows.item(0).b;
					var subn3=results.rows.item(0).c;
					var subn4=results.rows.item(0).d;
					var subn5=results.rows.item(0).e;
					var subn6=results.rows.item(0).f;
					var mark1=results.rows.item(0).ca;
					var mark2=results.rows.item(0).cb;
					var mark3=results.rows.item(0).cc;
					var mark4=results.rows.item(0).cd;
					var mark5=results.rows.item(0).ce;
					var mark6=results.rows.item(0).cf;
					$("#userciapara").html(subn1+":"+mark1+"<br/>"+subn2+":"+mark2+"<br/>"+subn3+":"+mark3+"<br/>"+subn4+":"+mark4+"<br/>"+subn5+":"+mark5+"<br/>"+subn6+":"+mark6+"<br/>");
				}
				else $("#userciapara").html("");
			});
		})
	}

	function addSemesterMarks(){
		var stuid=$("#studregid").val();
		var subj1=$("#subj1").val();
		var subj2=$("#subj2").val();
		var subj3=$("#subj3").val();
		var subj4=$("#subj4").val();
		var subj5=$("#subj5").val();
		var subj6=$("#subj6").val();
	}

	

	//DOM is ready
	document.addEventListener('deviceready',function(){
		dbName=window.sqlitePlugin.openDatabase({name: "sms.db"});//Opens DB
		setupDB();
		//Device Ready
	},false);

	/**Function Calls**/
	$("#loginbtn").tap(loginCheck);//Login Checking
	$("#addsubjectbtn").tap(addSubjects);//Add Subjects
	$("#addstudentbtn").tap(addStudent);//Add Students
	$("#viewprofilebtn").tap(showProfileDetails);//View Profile Details
	$("#addattendancebtn").tap(addAttendance);//Add Attendance Details
	$("#viewattendancebtn").tap(fetchAttendanceDetails);//View Attendance Details
	$("#addciamarkbtn").tap(addCIAMarks);//Add CIA Marks
	$("#viewciabtn").tap(function(){
		showCIADetails($("#cianame :selected").text());
	});
	$("#addciamarks").tap(function(){
		fetchSemesterDetails($("#semesterlist :selected").text());
	});
});