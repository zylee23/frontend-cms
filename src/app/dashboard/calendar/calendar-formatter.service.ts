import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { DashboardPageModule } from '../dashboard.module';
import { Platform } from '@ionic/angular';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
    /**
     * Stores the Platform service to detect the application platform used
     */
    private injectorPlatform: Platform = DashboardPageModule.platformInjector;

    /**
     * Format a text value based on the device platform
     *
     * @param mobileCallback the callback to invoke when using mobile devices
     * @param desktopCallback the callback to invoke when using desktops
     * @returns the formatted text value
     */
    private formatByDevicePlatform(
        mobileCallback: () => string,
        desktopCallback: () => string) {
            if (this.injectorPlatform.is("desktop")) {
                return desktopCallback();
            } else if (this.injectorPlatform.is("mobile")) {
                return mobileCallback();
            }
            return mobileCallback();
    }

    public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
        return this.formatByDevicePlatform(
            () => formatDate(date, 'EEEEEE', locale),
            () => formatDate(date, 'EEEE', locale));
    }

    public weekViewColumnSubHeader({ date, locale, }: DateFormatterParams): string {
        return this.formatByDevicePlatform(
            () => formatDate(date, 'dd', locale),
            () => formatDate(date, 'dd/MM', locale),
        )
    }
}
