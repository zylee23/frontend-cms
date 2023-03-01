import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { MicrophoneService } from './microphone.service';

describe('MicrophoneService', () => {
  let service: MicrophoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ]
    });
    service = TestBed.inject(MicrophoneService);
  });

  it('Microphone service should be created', () => {
    expect(service).toBeDefined();
  });
});
