import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityService } from '../community.service';
import { Subscription } from 'rxjs';
import { ICommunity, IProduct } from '@sharemunity-workspace/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../product/product.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'sharemunity-workspace-community-choose-list',
  templateUrl: './community-choose-list.component.html',
  styleUrl: './community-choose-list.component.css',
})
export class CommunityChooseListComponent implements OnInit {
  @Input({required:false}) viewList:boolean = false;
  @Output() closePop = new EventEmitter<void>();
  subscription: Subscription | undefined = undefined;
  communities: ICommunity[] | null = null;

  protected communityChooseForm!:FormGroup;
  protected product!:IProduct;



  constructor(private formBuilder:FormBuilder,private router:Router,private communityService: CommunityService,private productService:ProductService,private activatedRoute:ActivatedRoute){

  }


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params)=>{
      let id = params.get('id');
      this.productService.read(id).subscribe((product) => {
        this.product = product;
      })
    })
    
    this.subscription = this.communityService.list().subscribe((communities) => {
      let prodId = this.product.id;
      this.communities = (communities ?? [] )?.filter(val =>{
        if(val.products.length > 0 ){
          return !val.products.some(prod => prod.id === prodId);
        }else{
          return true;
        }
      })
    });
    
    this.communityChooseForm = this.formBuilder.group({
      selectedCommunities: this.formBuilder.array([])
    });
  }

  onCheckBoxChange(event:any, community:ICommunity){
    const selectedCommunities = this.communityChooseForm.get('selectedCommunities') as FormArray;
    if(event.target.checked){
      selectedCommunities.push(this.formBuilder.control(community));
    }else{
      let index = selectedCommunities.controls.findIndex(x => x.value.id === community.id);
      if(index !== -1){
        selectedCommunities.removeAt(index);
      }
    }
    console.log(selectedCommunities.value);
  }

  addProductToCommunity(){
    const coms = (this.communityChooseForm.get('selectedCommunities') as FormArray).value as ICommunity[];
    if(this.product != null){
      coms.forEach((com)=>{
        Array.isArray(com.products) ? com.products.push(this.product) : com.products =[this.product]
        this.communityService.update(com).subscribe(()=>{
          console.log(`Community ${com.id} updated with product ${this.product.id}`);
        });
      })
    }
    this.closePop.emit();
  }

  closePopup(){
    this.closePop.emit();
  }

}
