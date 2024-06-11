import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Driver } from '../models/driver.model';
import { DriverService } from '../services/driver.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent implements OnInit {
  driver: Driver = {
    driver_name: '',
    plate_number: '',
    bus_route: '',
    email: '',
    password: '',
  };
  submitted = false;
  personalForm!: FormGroup;
  personalData!: any[];
  actionBtn: string = 'Save';
  editedIndex: any;
  dataSource: any;
  maxDate?: string;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>,
    private driverService: DriverService,
    private router: Router
  ) {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0]; //future dates cannot be selected
  }

  ngOnInit(): void {
    this.personalForm = this.formBuilder.group({
      driver_name: ['', Validators.required],
      plate_number: ['', Validators.required],
      bus_route: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
          ),
        ],
      ], //domainValidator()
      password: ['', [Validators.required]],
    });

    const savedData = localStorage.getItem('personalInfo');
    if (savedData) {
      this.personalData = JSON.parse(savedData);
    } else {
      this.personalData = []; //creates an empty array to store future data
    }
    console.log('this.editData: ' + this.editData._id);
    if (this.editData) {
      this.actionBtn = 'Update';
      // this.personalForm.controls['_id'].setValue(this.editData._id);
      this.personalForm.controls['driver_name'].setValue(
        this.editData.driver_name
      );
      this.personalForm.controls['plate_number'].setValue(
        this.editData.plate_number
      );
      this.personalForm.controls['bus_route'].setValue(this.editData.bus_route);
      this.personalForm.controls['email'].setValue(this.editData.email);
      this.personalForm.controls['password'].setValue(this.editData.password);
    }
  }

    saveDriver(): void {
      const data = {
        driver_name: this.personalForm.get('driver_name')?.value,
        plate_number: this.personalForm.get('plate_number')?.value,
        bus_route: this.personalForm.get('bus_route')?.value,
        email: this.personalForm.get('email')?.value,
        password: this.personalForm.get('password')?.value,
      };
      console.log(this.editData._id);
      if (this.editData._id) {
        var id = this.editData._id;
        this.driverService.update(id, data).subscribe({
          next: (res) => {
            console.log(res);
            this.submitted = true;
            window.location.reload();
          },
          error: (e) => console.error(e),
        });
      } else {
        this.driverService.create(data).subscribe({
          next: (res) => {
            console.log(res);
            this.submitted = true;
            window.location.reload();
          },
          error: (e) => console.error(e),
        });
      }
    }

  newDriver(): void {
    this.submitted = false;
    this.driver = {
      driver_name: '',
      plate_number: '',
      bus_route: '',
      email: '',
      password: '',
    };
  }
}
