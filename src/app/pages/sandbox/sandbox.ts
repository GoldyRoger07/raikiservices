import { Component } from '@angular/core';
import { Container } from "../../components/container/container";
import { SeparatorDesign } from "../../components/separator-design/separator-design";

@Component({
  selector: 'app-sandbox',
  imports: [Container, SeparatorDesign],
  templateUrl: './sandbox.html',
  styleUrl: './sandbox.css',
})
export default class Sandbox {}
