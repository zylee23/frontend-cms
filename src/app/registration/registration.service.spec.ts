import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { UserRegistration } from '../model/registration.model';

import { RegistrationService } from './registration.service';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const registration: UserRegistration = {
    name: "Peter Parker",
    dob: new Date(),
    address1: "1408 Longview Avenue, Queens",
    clinic: 1,
    city: "Subang Jaya",
    postcode: "11413",
    state: "Selangor",
    contactNumber: 1234567890,
    email: "peterparker@email.com",
    newPassword: "#fit3162",
    reNewPassword: "#fit3162",
  };

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['post']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
      providers: [
        {
          provide: HttpClient,
          useValue: httpSpy,
        },
      ],
    });
    service = TestBed.inject(RegistrationService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('Registration service should be created', () => {
    expect(service).toBeDefined();
  });

  it("Expect successful registration to prompt success message", () => {
    // Setup http post mock
    httpClientSpy.post.and.returnValue(of("Success"));

    // Spy on the method for future checking
    spyOn(service, "accountCreated");

    // Perform new registration
    service.registerNewUser(registration);

    expect(service.accountCreated).toHaveBeenCalled();
  });

  it("Expect unsuccessful registration to prompt error message", () => {
    // Setup http post mock
    const error = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found',
    });
    httpClientSpy.post.and.returnValue(throwError(error));

    // Spy on the method for future checking
    spyOn(service, "accountNotCreated");

    // Perform new registration
    service.registerNewUser(registration);

    expect(service.accountNotCreated).toHaveBeenCalled();
  });

  it("Expect successful validation of password", () => {
    const
      newPassword = "fit3162",
      reNewPassword = "fit3162";

    const formGroup = new FormGroup({
      newPassword: new FormControl(newPassword),
      reNewPassword: new FormControl(reNewPassword),
    })

    expect(service.matchValidator("newPassword", "reNewPassword")(formGroup)).toBeNull();
  });

  it("Expect unsuccessful validation of password", () => {
    const
      newPassword = "fit3162",
      reNewPassword = "fit3161";

    const formGroup = new FormGroup({
      newPassword: new FormControl(newPassword),
      reNewPassword: new FormControl(reNewPassword),
    })

    const invalidation: {[mismatch: string]: boolean} = service.matchValidator("newPassword", "reNewPassword")(formGroup);
    expect(invalidation.mismatch).toBeTrue();
  });
});
