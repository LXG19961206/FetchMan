// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {frontend} from '../models';
import {model} from '../models';

export function GetPort():Promise<number>;

export function NativeFileDialog(arg1:frontend.OpenDialogOptions,arg2:boolean):Promise<model.FileInfo>;

export function NativeMessageDialog(arg1:frontend.MessageDialogOptions):Promise<string>;

export function SimpleRequest(arg1:model.AppRequest):Promise<any>;
