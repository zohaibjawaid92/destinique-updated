import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { FilterOption } from 'src/app/shared/interfaces/advanced-filter-options.interface';
import { SearchStateService } from 'src/app/shared/services/search-state.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent {
  showMoreViewTypes = false;

  advanceFilterForm: FormGroup;

  readonly amenityOptions: FilterOption[] = [
    { name: 'Private Pool', id: '1' },
    { name: 'Community Pool', id: '2' },
    { name: 'Handicap Accessible', id: '3' },
    { name: 'Boat Dock', id: '4' }
  ];

  readonly providerOptions: FilterOption[] = [
    { name: 'Airbnb', id: '127' },
    { name: 'BookBeach', id: '727' },
    { name: 'Decastay', id: '1234' },
    { name: 'Foreverdestinbeachrentals', id: '244' },
    { name: 'GulfStyleRentals', id: '1119' },
    { name: 'Pinkieflamingo', id: '352' },
    { name: 'RentaleScapes', id: '653' },
    { name: 'Royalpalmsrealty', id: '1284' },
    { name: 'Saltwatervacay', id: '21' },
    { name: 'Seaeoluxuryvacations', id: '1046' },
    { name: 'TheTopVillas', id: '43' },
    { name: 'Vrbo', id: '44' }
  ];

  readonly propertyTypeOptions: FilterOption[] = [
    { name: 'Condo', id: 'condo' },
    { name: 'Private Home', id: 'private-home' },
    { name: 'Town Home', id: 'town-home' },
    { name: 'Chalet', id: 'chalet' }
  ];

  readonly viewTypeOptions: FilterOption[] = [
    { name: 'Gulf-Front/Ocean-Front View', id: 'gulf-front' },
    { name: 'Pool View', id: 'pool' },
    { name: 'Wooded View', id: 'wooded' },
    { name: 'Lake Front View', id: 'lake-front' },
    { name: 'City/Community View', id: 'city' },
    { name: 'Partial Gulf/Ocean View', id: 'partial-gulf' }
  ];

  constructor(
    private fb: FormBuilder,
    private searchState: SearchStateService
  ) {
    this.advanceFilterForm = this.fb.group({
      bedrooms: [null as number | null],
      bathrooms: [null as number | null],
      propertyTypes: this.fb.array([]),
      viewTypes: this.fb.array([]),
      searchExact: [false],
      petFriendly: [false],
      amenity: this.fb.array([]),
      providers: this.fb.array([])
    });
  }

  get bedroomsLabel(): string {
    const v = this.advanceFilterForm.get('bedrooms')?.value;
    return v == null || v === '' || v === 0 ? 'Any' : String(v);
  }

  get bathroomsLabel(): string {
    const v = this.advanceFilterForm.get('bathrooms')?.value;
    return v == null || v === '' || v === 0 ? 'Any' : String(v);
  }

  get propertyTypesArray(): FormArray {
    return this.advanceFilterForm.get('propertyTypes') as FormArray;
  }

  get viewTypesArray(): FormArray {
    return this.advanceFilterForm.get('viewTypes') as FormArray;
  }

  get amenityArray(): FormArray {
    return this.advanceFilterForm.get('amenity') as FormArray;
  }

  get providersArray(): FormArray {
    return this.advanceFilterForm.get('providers') as FormArray;
  }

  toggleShowMoreViewTypes(): void {
    this.showMoreViewTypes = !this.showMoreViewTypes;
  }

  changeBedrooms(delta: number): void {
    const control = this.advanceFilterForm.get('bedrooms');
    const current = control?.value ?? 0;
    const next = Math.max(0, Math.min(15, (current || 0) + delta));
    control?.setValue(next === 0 ? null : next);
  }

  changeBathrooms(delta: number): void {
    const control = this.advanceFilterForm.get('bathrooms');
    const current = control?.value ?? 0;
    const next = Math.max(0, Math.min(15, (current || 0) + delta));
    control?.setValue(next === 0 ? null : next);
  }

  private getSelectedValues(formArray: FormArray): string[] {
    return (formArray.value as string[]) || [];
  }

  private toggleInFormArray(formArray: FormArray, name: string): void {
    const values = this.getSelectedValues(formArray);
    const idx = values.indexOf(name);
    formArray.clear();
    if (idx === -1) {
      values.push(name);
    } else {
      values.splice(idx, 1);
    }
    values.forEach(val => formArray.push(new FormControl(val)));
  }

  isSelectedIn(formArray: FormArray, name: string): boolean {
    return this.getSelectedValues(formArray).includes(name);
  }

  toggleAmenity(name: string): void {
    this.toggleInFormArray(this.amenityArray, name);
  }

  toggleProvider(name: string): void {
    this.toggleInFormArray(this.providersArray, name);
  }

  togglePropertyType(name: string): void {
    this.toggleInFormArray(this.propertyTypesArray, name);
  }

  toggleViewType(name: string): void {
    this.toggleInFormArray(this.viewTypesArray, name);
  }

  onApplyFilter(event: Event): void {
    event.preventDefault();
    const raw = this.advanceFilterForm.getRawValue();
    const bedrooms = raw.bedrooms;
    const bathrooms = raw.bathrooms;
    this.searchState.updateAdvancedFilters({
      minBedrooms: bedrooms != null && bedrooms !== '' && bedrooms > 0 ? Number(bedrooms) : undefined,
      minBathrooms: bathrooms != null && bathrooms !== '' && bathrooms > 0 ? Number(bathrooms) : undefined,
      amenities: (raw.amenity as string[]) || [],
      providers: (raw.providers as string[]) || [],
      propertyTypes: (raw.propertyTypes as string[]) || [],
      viewTypes: (raw.viewTypes as string[]) || [],
      searchExact: !!raw.searchExact,
      petFriendly: !!raw.petFriendly
    });
  }

  onReset(): void {
    this.advanceFilterForm.patchValue({
      bedrooms: null,
      bathrooms: null,
      searchExact: false,
      petFriendly: false
    }, { emitEvent: false });
    this.propertyTypesArray.clear();
    this.viewTypesArray.clear();
    this.amenityArray.clear();
    this.providersArray.clear();
    this.searchState.resetFilters();
  }
}
