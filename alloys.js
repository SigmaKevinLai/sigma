'use strict';
// Transcribed from official company specifications, retrieved 2026-10-06.
const alloyComposition={
 'ADC 3':['9.0–10.0','≤ 0.9','≤ 0.6','≤ 0.3','0.40–0.6','≤ 0.5','≤ 0.5','≤ 0.1'],
 'ADC 6':['≤ 1.0','≤ 0.6','≤ 0.1','0.4–0.6','2.6–4.0','≤ 0.1','≤ 0.4','≤ 0.1'],
 'ADC 10':['7.5–9.5','≤ 0.9','2.0–4.0','≤ 0.5','≤ 0.3','≤ 0.5','≤ 1.0','≤ 0.2'],
 'ADC 12':['9.6–12.0','≤ 0.9','1.5–3.5','≤ 0.5','≤ 0.3','≤ 0.5','≤ 1.0','≤ 0.2'],
 'ADC 14':['16.0–18.0','≤ 0.9','4.0–5.0','≤ 0.5','0.50–0.65','≤ 0.3','≤ 1.5','≤ 0.3']
};
const elements=[['Si','矽'],['Fe','鐵'],['Cu','銅'],['Mn','錳'],['Mg','鎂'],['Ni','鎳'],['Zn','鋅'],['Sn','錫']];
const left=document.querySelector('#alloy-left');
const right=document.querySelector('#alloy-right');
[left,right].forEach(select=>{Object.keys(alloyComposition).forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;select.append(option);});});
left.value='ADC 12';right.value='ADC 10';
function updateComparison(){
 const a=left.value,b=right.value;
 document.querySelector('#alloy-head-left').textContent=a;
 document.querySelector('#alloy-head-right').textContent=b;
 const tbody=document.querySelector('#composition-body');tbody.replaceChildren();
 let differences=0;
 elements.forEach(([symbol,name],index)=>{const row=document.createElement('tr');const header=document.createElement('th');header.scope='row';header.textContent=symbol+' · '+name;row.append(header);const different=alloyComposition[a][index]!==alloyComposition[b][index];if(different)differences++;[a,b].forEach(alloy=>{const td=document.createElement('td');td.textContent=alloyComposition[alloy][index];if(different){td.className='different';const note=document.createElement('span');note.className='visually-hidden';note.textContent='（兩牌號數值不同）';td.append(note);}row.append(td);});tbody.append(row);});
 document.querySelector('#comparison-status').textContent=a===b?'您正在查看同一牌號；可選擇另一牌號比較。':a+' 與 '+b+'：'+differences+' 項列示成分範圍不同。差異不代表材料優劣。';
}
[left,right].forEach(select=>select.addEventListener('change',updateComparison));updateComparison();
