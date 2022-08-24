import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

// import formgroup in ts file
// then import in app module
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  // we can initialise here also
  signupForm: FormGroup;

  forbiddenUsernames = ['Chris', 'Anna'];

  ngOnInit() {
    // we should initialise it before rendering the template of course, so make sure to use a lifecycle hook, which is called before the template is rendered.
    // signupform is of type formgroup, so we need to create a new formgroup here, and we need to pass JS object here
    // this JS object configures it and as its empty, it simply says or it tells Angular that this form doesnt have any controls, so lets add some. controls are basically just key-value pairs in this object, we pass to the overall FormGroup
    this.signupForm = new FormGroup({
      // this is a formcontrol and we need to import FormControl here and to this formcontrol constructor, we can pass a couple of arguments
      // first argument is the initial state, the inital value of this control we could say.
      // second argument will be a single validator or an array of validators, we want to apply to this control, 
      // third argument will be potential asynchronous validators, 
      // now we are passing second argument, validators, and make sure not to call it and not to execute it, so dont have parenthesis here, here we only want to pass the reference to this method, angular will execute the method whenever it detects that the input of this formcontrol changed, so it just needs to have a reference on what it should execute at this point of time.
      // example of giving path , by creating a formgroup named userdata, we can also formgroups in the form groups
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        // dont execute the forbiddenemails, simply pass the reference
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
      }),
      // 'username': new FormControl(null, Validators.required),
      // can have multiple validators by simply passing an array of validators.
      // 'email': new FormControl(null, [Validators.required, Validators.email]),
      'gender': new FormControl('male'),
      // after adding hobbies, we now want to add controls - and hobbies will be error because there could be no hobbies or there could be 10 or 100 hobbies
      // formarray holds an array of controls, so we apss an array here to initialise it. in this array, we could already initialise  some form controls with new formcontrol or it can be left empty
      'hobbies': new FormArray([]),
    });
    // and we can call this on individual form control
    // this.signupForm.valueChanges.subscribe(
    //   (value) => console.warn(value)
    // );
    this.signupForm.statusChanges.subscribe(
      (status) => console.warn(status)
    );

    // we can on our form call setValue and pass a JS object which should now resemble the object structure up here when we reate the form - 
    this.signupForm.setValue({
      'userData': {
        'username': 'Max',
        'email': 'max@test.com',
      },
      'gender': 'male',
      'hobbies': []
    });
    this.signupForm.patchValue({
      'userData': {
        'username': 'MaAnnax',
      }
    });
 
  }
  // the diff between td approach is that we dont need to get the form via this local reference, that actually wouldn't wokr anymore, because we are not using angular's auto creation  mechanism, but we dont need to get this reference because we created the form on our own, we already got access to it here in our TS code, actually in every method in the TS code. So, we can simply console log this signupForm, just
  onSubmit() {
    console.warn(this.signupForm);
    this.signupForm.reset();
  }

  onAddHobby() {
    // we have to tell explicitely that this of type formarray to avoid error, so here we will typecaste it, but we wont see it, we need to synchronize it with the HTML code
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }
  // here below if validation is successfull, we have to pass nothing or null, it should have null of nothing no like return false, it will return true if its invalid
  // below will give error and now we want to add bind this
  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return { 'nameIsForbidden': true };
    }
    return null;
  }

  // creating a asynchronous validator and these are 2 constructs which handle asynchronous data, thats what exactly this validator is about
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    // this recieves a function with resolve and reject as arguments, we can execute in that function and in that function, I want to set a time out after one aand a half seconds
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          // if this is the case, validation failed and as in the synchronous validator case, this is when I will return an object with a key-value pair with this error code.
          // since we are in promise, we dont return, we resolve and again we resolve this object where we say emailisforbidden
          resolve({ 'emailIsForbidden': true });
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
    // now we need to add it to email validators, so we will pass through as third argument
  }

}

// now we need to synchronize our html inputs and our own form or this form in general with our own form
// righ now angular doesnt know, which of our Ts controls here relates to which input in our template code, it actually even doesnt know that our form, signupform here should be attached to this form.
// right now, the one thing it is doing is it that, it is autodetecting that this is a form and it creates a form for us.
// so we have to add some directives to overwrite this default behaviour to give angular instructions.
// for these directives to work, we need to add the import  to reactive forms module in opur app module, otherwise it will get errors

// in reactive forms, we are not creating forms in the directives, we only are binding it with the directives, formcontrolname and formgroup, but we are configuring it in the TS code, thats why form control takes more than one argument, this constructor here