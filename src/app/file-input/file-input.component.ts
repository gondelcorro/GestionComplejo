import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-file-input',
  standalone: false,
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true
    }
  ]
})
export class FileInputComponent implements ControlValueAccessor {

  @Input() accept = '.jpg,.jpeg';
  @Input() multiple = false;
  @Input() maxSize = 3 * 1024 * 1024; // 3 MB
  @Input() title = '';

  @Output() fileSelected = new EventEmitter<File | File[]>();

  fileName = '';
  errorMessage = '';

  private disabled = false;

  private onChange: (value: File | File[] | null) => void = () => {
  };
  private onTouched: () => void = () => {
  };

  // --------------------------------------------------
  // ControlValueAccessor
  // --------------------------------------------------

  writeValue(value: File | File[] | null): void {

    if (!value) {
      this.fileName = '';
      return;
    }

    if (Array.isArray(value)) {
      this.fileName = value
        .map(file => file.name)
        .join(', ');
    } else {
      this.fileName = value.name;
    }
  }

  registerOnChange(
    fn: (value: File | File[] | null) => void
  ): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // --------------------------------------------------
  // Selección del archivo
  // --------------------------------------------------

  onFileSelected(event: Event): void {

    if (this.disabled) {
      return;
    }

    this.errorMessage = '';

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {

      this.fileName = '';

      this.onChange(null);
      this.onTouched();

      return;
    }

    const files = Array.from(input.files);

    // --------------------------------------------------
    // Validar JPG
    // --------------------------------------------------

    const invalidType = files.some(file => {

      const extension = file.name
        .split('.')
        .pop()
        ?.toLowerCase();

      return extension !== 'jpg' && extension !== 'jpeg';
    });

    if (invalidType) {

      this.errorMessage =
        'Solo se permiten archivos JPG.';

      input.value = '';
      this.fileName = '';

      this.onChange(null);
      this.onTouched();

      return;
    }

    // --------------------------------------------------
    // Validar tamaño
    // --------------------------------------------------

    const oversized = files.some(
      file => file.size > this.maxSize
    );

    if (oversized) {

      this.errorMessage =
        'La imagen no puede superar los 3 MB.';

      input.value = '';
      this.fileName = '';

      this.onChange(null);
      this.onTouched();

      return;
    }

    // --------------------------------------------------
    // Guardar archivo
    // --------------------------------------------------

    const value: File | File[] = this.multiple
      ? files
      : files[0];

    if (Array.isArray(value)) {

      this.fileName = value
        .map(file => file.name)
        .join(', ');

    } else {

      this.fileName = value.name;
    }

    // Informar a Reactive Forms
    this.onChange(value);

    // Marcar como touched
    this.onTouched();

    // Mantener también el evento por si lo necesitás
    this.fileSelected.emit(value);
  }

  get isDisabled(): boolean {
    return this.disabled;
  }
}
