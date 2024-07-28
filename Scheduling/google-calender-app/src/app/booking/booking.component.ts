import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var createGoogleEvent: any;

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent implements OnInit {
  constructor(private fb: FormBuilder) { }
  appointmentForm!: FormGroup;

  ngOnInit() {
    this.appointmentForm = this.fb.group({
      appointmentTime: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.email]],
      surname: ['', [Validators.required, Validators.email]],
      professional: ['', [Validators.required, Validators.email]],
    });
  }

  // Function to handle the button click event to schedule a meeting.
  scheduleMeeting() {
    let appointmentTime = new Date(this.appointmentForm.value.appointmentTime);
    // Convert the date to the desired format with a custom offset (e.g., -03:00 for Brasilia)
    const startTime = this.formatDateToBrasilia(appointmentTime);
    const endTime = this.formatDateToBrasilia(this.getEndTime(appointmentTime));
    const eventDetails = {
      name: this.appointmentForm.value.name,
      surname: this.appointmentForm.value.surname,
      professional: this.appointmentForm.value.professional,
      email: this.appointmentForm.value.email,
      startTime: startTime,
      endTime: endTime,
    };
    console.info(eventDetails);
    createGoogleEvent(eventDetails);
  }

  getEndTime(appointmentTime: Date) {
    // Add one hour to the date
    appointmentTime.setHours(appointmentTime.getHours() + 1);
    return appointmentTime;
  }

  generateICSFile() {
    const datetimeValue = this.appointmentForm.value.appointmentTime;
    const date = new Date(datetimeValue);
    const endTime = new Date(date);
    endTime.setHours(endTime.getHours() + 1);
    // Format dates to be in the proper format for the .ics file
    const formattedStartDate = date
      .toISOString()
      .replace(/-/g, '')
      .replace(/:/g, '')
      .slice(0, -5);
    const formattedEndDate = endTime
      .toISOString()
      .replace(/-/g, '')
      .replace(/:/g, '')
      .slice(0, -5);
    // Event details
    const eventName = 'Sample Event';
    const eventDescription = 'This is a sample event';
    const location = 'Sample Location';
    // Create the .ics content
    const icsContent = `BEGIN:VCALENDAR
  VERSION:2.0
  BEGIN:VEVENT
  DTSTAMP:${formattedStartDate}Z
  DTSTART:${formattedStartDate}Z
  DTEND:${formattedEndDate}Z
  SUMMARY:${eventName}
  DESCRIPTION:${eventDescription}
  LOCATION:${location}
  END:VEVENT
  END:VCALENDAR`;
    // Create a Blob containing the .ics content
    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    });
    // Create a download link for the Blob
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'event.ics';
    // Trigger the download
    downloadLink.click();
  }

  formatDateToBrasilia(date: Date) {
    const offset = -3; // Offset for Brasilia time
    const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return localISOTime.slice(0, 19) + `-0${Math.abs(offset)}:00`;
  }
}

