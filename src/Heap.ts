/**
 * 二叉堆
 */
export class Heap<T> {
  cmp: (a: T, b: T) => boolean;
  nodes: T[];
  /**
   * @param cmp a是否应该在b上方，如果是返回true，否则返回false
   */
  constructor(cmp?: (a: T, b: T) => boolean){
    this.nodes = [];
    this.cmp = cmp ?? ((a, b) => a < b);
  }

  insert(node: T){
    this.nodes.push(node);
    let id = this.nodes.length - 1;
    let parentId = Math.floor((id - 1) / 2);
    while(id !== 0 && !this.cmp(this.nodes[parentId], this.nodes[id])){
      this.swap(id, parentId);
      id = parentId;
      parentId = Math.floor((id - 1) / 2);
    }
  }

  private swap(a: number, b: number){
    const tmp = this.nodes[a];
    this.nodes[a] = this.nodes[b];
    this.nodes[b] = tmp;
  }

  get top(){
    return this.nodes[0] ?? null;
  }

  pop(){
    if(this.empty()) return null;
    const top = this.nodes[0];
    if(this.nodes.length <= 1){
      this.nodes.pop();
      return top;
    }
    this.nodes[0] = this.nodes.pop() as T;
    let id = 0;
    const size = this.nodes.length - 1;
    let l = Math.min(size, id * 2 + 1);
    let r = Math.min(size, id * 2 + 2);
    while(id < size){
      const pl = this.cmp(this.nodes[id], this.nodes[l]);
      const pr = this.cmp(this.nodes[id], this.nodes[r]);
      if(!pl && !pr){
        if(this.cmp(this.nodes[l], this.nodes[r])){
          this.swap(id, l);
          id = l;
        }else{
          this.swap(id, r);
          id = r;
        }
      }else if(!pl){
        this.swap(id, l);
        id = l;
      }else if(!pr){
        this.swap(id, r);
        id = r;
      }else{
        break;
      }
      l = Math.min(size, id * 2 + 1);
      r = Math.min(size, id * 2 + 2);
    }
    return top;
  }

  empty(){
    return this.nodes.length <= 0;
  }

  clear(){
    this.nodes = [];
  }
}