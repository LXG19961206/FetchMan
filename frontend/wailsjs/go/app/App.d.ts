// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {folder} from '../models';
import {model} from '../models';
import {filelike} from '../models';
import {request} from '../models';
import {app} from '../models';
import {frontend} from '../models';

export function AddCollectionFolder(arg1:string,arg2:number):Promise<folder.Folder>;

export function AddRequest(arg1:model.AppRequest):Promise<any>;

export function AddRequestToCollection(arg1:number,arg2:string):Promise<filelike.FileLike>;

export function CloseTab(arg1:number):Promise<void>;

export function DelFileLikeRecord(arg1:number):Promise<void>;

export function GetBaseUrl():Promise<string>;

export function GetFilePathPlaceholder():Promise<string>;

export function GetFileUrl():Promise<string>;

export function GetPort():Promise<number>;

export function GetRecordById(arg1:number):Promise<{[key: string]: any}>;

export function GetRequestById(arg1:number):Promise<request.RequestRecord>;

export function GetSpecialFields():Promise<app.SpecialReqHeaderFields>;

export function LsAllTabs():Promise<Array<{[key: string]: any}>>;

export function LsCollectionFolder(arg1:number):Promise<Array<folder.Folder>>;

export function LsRequestOfCollection(arg1:number):Promise<Array<filelike.FileLike>>;

export function NativeFileDialog(arg1:frontend.OpenDialogOptions,arg2:boolean):Promise<app.FileInfo>;

export function NativeMessageDialog(arg1:frontend.MessageDialogOptions):Promise<string>;

export function RemoveCollection(arg1:number):Promise<void>;

export function RenameFileLikeRequest(arg1:string,arg2:number):Promise<void>;

export function RenameFolder(arg1:string,arg2:number):Promise<void>;

export function SimpleRequest(arg1:model.AppRequest):Promise<any>;

export function StartNewTab():Promise<number>;

export function UpdateTabInfo(arg1:model.TabPage):Promise<string>;
